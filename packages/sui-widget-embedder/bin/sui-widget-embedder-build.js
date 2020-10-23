#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const staticModule = require('static-module')
const minifyStream = require('minify-stream')
const flatten = require('just-flatten-it')
const zlib = require('zlib')

const gzip = zlib.createGzip()
const brotli = require('iltorb').compressStream

const path = require('path')
const {resolve} = path
const {
  readdirSync,
  statSync,
  createReadStream,
  createWriteStream
} = require('fs')
const {showError} = require('@s-ui/helpers/cli')
const compilerFactory = require('../compiler/production')

const FILE_DOWNLOADER = 'downloader.js'
const FILE_SW = 'sw.js'

const PAGES_FOLDER = 'pages'
const PAGES_PATH = resolve(process.cwd(), PAGES_FOLDER)
const PUBLIC_PATH = resolve(process.cwd(), 'public')

const pkg = require(resolve(process.cwd(), 'package.json'))
const config = pkg.config || {}
const suiWidgetEmbedderConfig = config['sui-widget-embedder'] || {}
const {manualCompression} = suiWidgetEmbedderConfig

program
  .option('-C, --clean', 'Remove public folder before create a new one')
  .option(
    '-R --remoteCdn <url>',
    'Remote url where the downloader will be placed'
  )
  .option(
    '-D --serviceWorkerCdn <url>',
    'Remote url where the browser will register the sw'
  )
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build all widgets statics')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embedder build')
    console.log('')
    console.log(
      ' You can even choose where should the downloader going to get the files:'
    )
    console.log(
      '    $ sui-widget-embedder build -remoteCdn http://mysourcedomain.com'
    )
    console.log('')
  })
  .parse(process.argv)

const remoteCdn = program.remoteCdn || suiWidgetEmbedderConfig.remoteCdn
const serviceWorkerCdn = program.serviceWorkerCdn || remoteCdn

if (program.clean) {
  console.log('Removing previous build...')
  rimraf.sync(PUBLIC_PATH)
}

const build = ({page, remoteCdn}) => {
  const compiler = compilerFactory({
    page,
    remoteCdn,
    globalConfig: suiWidgetEmbedderConfig
  })
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        reject(error)
        return
      }

      const jsonStats = stats.toJson()

      if (stats.hasErrors()) {
        reject(jsonStats.errors)
        return
      }

      if (stats.hasWarnings()) {
        console.log('Webpack generated the following warnings: ')
        jsonStats.warnings.map(warning => console.log(warning))
      }

      console.log(`Webpack stats: ${stats}`)
      resolve()
    })
  })
}

const pagesFor = ({path}) =>
  readdirSync(path).filter(file => statSync(resolve(path, file)).isDirectory())

const manifests = () =>
  pagesFor({path: PUBLIC_PATH}).reduce((acc, page) => {
    acc[page] = require(resolve(
      process.cwd(),
      'public',
      page,
      'asset-manifest.json'
    ))
    return acc
  }, {})

const pageConfigs = () =>
  pagesFor({path: PAGES_PATH}).reduce(
    (acc, page) => ({
      ...acc,
      [page]: require(resolve(
        process.cwd(),
        PAGES_FOLDER,
        page,
        'package.json'
      ))
    }),
    {}
  )

const createBrotli = file =>
  new Promise(resolve => {
    createReadStream(path.resolve(process.cwd(), 'public', file))
      .pipe(brotli())
      .pipe(
        createWriteStream(
          path.resolve(process.cwd(), 'public', `${file}.br`)
        ).on('finish', resolve)
      )
  })

const createGzip = file =>
  new Promise(resolve => {
    createReadStream(path.resolve(process.cwd(), 'public', file))
      .pipe(gzip)
      .pipe(
        createWriteStream(
          path.resolve(process.cwd(), 'public', `${file}.gz`)
        ).on('finish', resolve)
      )
  })

const createDownloader = () =>
  // eslint-disable-next-line
  new Promise((res, rej) => {
    const staticManifests = manifests()
    const staticPageConfigs = pageConfigs()
    createReadStream(resolve(__dirname, '..', 'downloader', 'index.js'))
      .pipe(
        staticModule({
          'static-manifests': () => JSON.stringify(staticManifests),
          'static-pageConfigs': () => JSON.stringify(staticPageConfigs),
          'static-cdn': () => JSON.stringify(remoteCdn),
          'service-worker-cdn': () => JSON.stringify(serviceWorkerCdn)
        })
      )
      .pipe(minifyStream({sourceMap: false}))
      .pipe(
        createWriteStream(resolve(process.cwd(), 'public', FILE_DOWNLOADER))
          .on('finish', () => {
            console.log(`Created a new ${FILE_DOWNLOADER} file`)

            if (manualCompression) {
              Promise.all([
                createBrotli(FILE_DOWNLOADER),
                createGzip(FILE_DOWNLOADER)
              ]).then(() => {
                console.log('Manually compressed downloader done!')
                res()
              })
            } else {
              res()
            }
          })
          .on('error', rej)
      )
      .on('error', rej)
  })

const createSW = () =>
  // eslint-disable-next-line
  new Promise((res, rej) => {
    const filename = 'workbox-sw.prod.v2.1.2'
    const staticManifests = manifests()
    const staticCache = flatten(
      Object.keys(staticManifests).map(page => {
        const manifest = staticManifests[page]
        return Object.keys(manifest)
          .map(entry => `${remoteCdn}/${page}/${manifest[entry]}`)
          .filter(url => !url.endsWith('.map'))
      })
    )
    const workboxImportPath = require.resolve(
      `workbox-sw/build/importScripts/${filename}`
    )

    createReadStream(resolve(__dirname, '..', 'downloader', FILE_SW))
      .pipe(
        staticModule({
          'static-cache': () => JSON.stringify(staticCache),
          'static-cdn': () => JSON.stringify(remoteCdn),
          'service-worker-cdn': () => JSON.stringify(serviceWorkerCdn)
        })
      )
      .pipe(minifyStream({sourceMap: false}))
      .pipe(
        createWriteStream(resolve(process.cwd(), 'public', FILE_SW)).on(
          'finish',
          () => {
            createReadStream(workboxImportPath).pipe(
              createWriteStream(resolve(process.cwd(), 'public', filename)).on(
                'finish',
                () => {
                  console.log('Create a new sw.js file')
                  res()
                }
              )
            )
          }
        )
      )
      .on('error', rej)
  })

const serialPromiseExecution = promises =>
  promises.reduce((acc, func) => acc.then(() => func()), Promise.resolve([]))

serialPromiseExecution(
  pagesFor({path: PAGES_FOLDER}).map(page => () => build({page, remoteCdn}))
)
  .then(createDownloader)
  .then(createSW)
  .catch(showError)

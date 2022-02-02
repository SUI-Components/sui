#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')

const path = require('path')
const {resolve} = path
const {readdirSync, statSync} = require('fs')
const {readFile, writeFile} = require('fs/promises')
const {showError} = require('@s-ui/helpers/cli')
const compilerFactory = require('../compiler/production.js')

const FILE_DOWNLOADER = 'downloader.js'

const PAGES_FOLDER = 'pages'
const PAGES_PATH = resolve(process.cwd(), PAGES_FOLDER)
const PUBLIC_PATH = resolve(process.cwd(), 'public')

const pkg = require(resolve(process.cwd(), 'package.json'))
const config = pkg.config || {}
const suiWidgetEmbedderConfig = config['sui-widget-embedder'] || {}

program
  .option('-C, --clean', 'Remove public folder before create a new one')
  .option(
    '-R --remoteCdn <url>',
    'Remote url where the downloader will be placed'
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
      if (error) return reject(error)

      console.log(`Webpack stats: ${stats}`)

      if (stats.hasErrors()) return reject(new Error('Webpack build failed'))
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

const createDownloader = async () => {
  const staticManifests = manifests()
  const staticPageConfigs = pageConfigs()

  const input = resolve(__dirname, '..', 'downloader', 'index.js')
  const output = resolve(process.cwd(), 'public', FILE_DOWNLOADER)

  try {
    const downloader = await readFile(input, 'utf-8')

    await writeFile(
      output,
      downloader
        .replace("require('static-manifests')", JSON.stringify(staticManifests))
        .replace(
          "require('static-pageConfigs')",
          JSON.stringify(staticPageConfigs)
        )
    )

    console.log(`Created a new ${FILE_DOWNLOADER} file`)
  } catch (e) {
    console.error(e)
    console.log(`Couldn't create ${FILE_DOWNLOADER} file`)
  }
}

const serialPromiseExecution = promises =>
  promises.reduce((acc, func) => acc.then(() => func()), Promise.resolve([]))

serialPromiseExecution(
  pagesFor({path: PAGES_FOLDER}).map(page => () => build({page, remoteCdn}))
)
  .then(createDownloader)
  .catch(showError)

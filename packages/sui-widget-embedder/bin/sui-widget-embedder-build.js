#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const staticModule = require('static-module')
const minifyStream = require('minify-stream')
const {resolve} = require('path')
const {readdirSync, statSync, createReadStream, createWriteStream} = require('fs')
const compilerFactory = require('../compiler/production')

const WIDGETS_PATH = resolve(process.cwd(), 'widgets')
const PUBLIC_PATH = resolve(process.cwd(), 'public')

const config = require(resolve(process.cwd(), 'package.json'))['sui-widget-embedder']
const exitWithMsg = msg => { console.log(msg); process.exit(1) }

program
  .option('-C, --clean', 'Remove public folder before create a new one')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build all widgets statics')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embedder build')
    console.log('')
  })
  .parse(process.argv)

if (program.clean) {
  console.log('Removing previous build...')
  rimraf.sync(PUBLIC_PATH)
}

const build = ({page}) => {
  const compiler = compilerFactory({page})
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) { reject(error) }

      const jsonStats = stats.toJson()

      if (stats.hasErrors()) {
        return jsonStats.errors.map(error => console.log(error))
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
  readdirSync(path)
    .filter(file => statSync(resolve(path, file)).isDirectory())

const createDownloader = () => {
  const manifests = pagesFor({path: PUBLIC_PATH}).reduce((acc, page) => {
    acc[page] = require(resolve(process.cwd(), 'public', page, 'asset-manifest.json'))
    return acc
  }, {})
  const pathnamesRegExp = pagesFor({path: WIDGETS_PATH}).reduce((acc, page) => {
    acc[page] = require(resolve(process.cwd(), 'widgets', page, 'package.json')).pathnameRegExp
    return acc
  }, {})

  createReadStream(resolve(__dirname, '..', 'donwloader', 'index.js'))
    .pipe(
      staticModule({
        'static-manifests': () => JSON.stringify(manifests),
        'static-pathnamesRegExp': () => JSON.stringify(pathnamesRegExp),
        'static-cdn': () => JSON.stringify(config.cdn)
      })
    )
    .pipe(minifyStream({sourceMap: false}))
    .pipe(createWriteStream(resolve(process.cwd(), 'public', 'downloader.js')))
  console.log('Create a new downloader.js file')
}

Promise.all(
  pagesFor({path: WIDGETS_PATH})
    .map(page => build({page}))
)
.then(createDownloader)
.catch(exitWithMsg)

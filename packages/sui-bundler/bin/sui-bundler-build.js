#!/usr/bin/env node
/* eslint-disable no-console */
// https://github.com/coryhouse/react-slingshot/blob/master/tools/build.js
const program = require('commander')
const rimraf = require('rimraf')
const webpack = require('webpack')
const path = require('path')
const staticModule = require('static-module')
const minifyStream = require('minify-stream')
const replaceStream = require('replacestream')
const config = require('../webpack.config.prod')
const fs = require('fs')
const {config: projectConfig} = require('../shared')

const linkLoaderConfigBuilder = require('../loaders/linkLoaderConfigBuilder')

// TODO: Extract this
const chalk = require('chalk')
const chalkError = chalk.red
const chalkSuccess = chalk.green
const chalkWarning = chalk.yellow
const chalkProcessing = chalk.blue

program
  .option('-C, --clean', 'Remove public folder before create a new one')
  .option(
    '--link-package [package]',
    'Replace each occurrence of this package with an absolute path to this folder',
    (v, m) => {
      m.push(v)
      return m
    },
    []
  )
  .option('-c, --context [folder]', 'Context folder (cwd by default)')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-bundler build -S')
    console.log('    $ sui-bundler build -SC')
    console.log('    $ sui-bundler dev --link-package /my/domain/folder')
    console.log('    $ sui-bundler build --help')
    console.log('')
  })
  .parse(process.argv)

const {clean = false, context} = program
config.context = context || config.context
const packagesToLink = program.linkPackage || []

const nextConfig = packagesToLink.length
  ? linkLoaderConfigBuilder({
      config,
      packagesToLink
    })
  : config

process.env.NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : 'production'

if (clean) {
  console.log(chalkProcessing('Removing previous build...'))
  rimraf.sync(path.resolve(process.env.PWD, 'public'))
}
console.log(
  chalkProcessing('Generating minified bundle. This will take a moment...')
)

webpack(nextConfig).run((error, stats) => {
  if (error) {
    console.log(chalkError(error))
    return 1
  }

  const jsonStats = stats.toJson()

  if (stats.hasErrors()) {
    return jsonStats.errors.map(error => console.log(chalkError(error)))
  }

  if (stats.hasWarnings()) {
    console.log(chalkWarning('Webpack generated the following warnings: '))
    jsonStats.warnings.map(warning => console.log(chalkWarning(warning)))
  }

  console.log(`Webpack stats: ${stats}`)

  const offlinePath = path.join(process.cwd(), 'src', 'offline.html')
  const offlinePageExists = fs.existsSync(offlinePath)

  const staticsCacheOnly =
    (projectConfig &&
      projectConfig.offline &&
      projectConfig.offline.staticsCacheOnly) ||
    false

  if (offlinePageExists) {
    fs.copyFileSync(
      path.resolve(offlinePath),
      path.resolve(process.cwd(), 'public', 'offline.html')
    )
  }

  if (offlinePageExists || staticsCacheOnly) {
    const manifest = require(path.resolve(
      process.cwd(),
      'public',
      'asset-manifest.json'
    ))

    const rulesOfFilesToNotCache = [
      'runtime~', // webpack's runtime chunks are not meant to be cached
      '.gz', // avoid gzipped files
      '.br', // avoid brotli files
      'LICENSE.txt', // avoid LICENSE files
      '.map' // source maps
    ]
    const manifestStatics = Object.values(manifest).filter(
      url => !rulesOfFilesToNotCache.some(rule => url.includes(rule))
    )

    const importScripts =
      (projectConfig &&
        projectConfig.offline &&
        projectConfig.offline.importScripts) ||
      []

    const stringImportScripts = importScripts
      .map(url => `importScripts("${url}")`)
      .join('\n')

    Boolean(importScripts.length) &&
      console.log('\nExternal Scripts Added to the SW:\n', stringImportScripts)

    // generates the service worker
    fs.createReadStream(path.resolve(__dirname, '..', 'service-worker.js'))
      .pipe(replaceStream('// IMPORT_SCRIPTS_HERE', stringImportScripts))
      .pipe(
        staticModule({
          'static-manifest': () => JSON.stringify(manifestStatics),
          'static-cache-name': () => JSON.stringify(Date.now().toString()),
          'static-statics-cache-only': () => JSON.stringify(staticsCacheOnly)
        })
      )
      .pipe(minifyStream({sourceMap: false}))
      .pipe(
        fs.createWriteStream(
          path.resolve(process.cwd(), 'public', 'service-worker.js')
        )
      )

    console.log('\nService worker generated succesfully!\n')
  }

  console.log(
    chalkSuccess(
      `Your app is compiled in ${process.env.NODE_ENV} mode in /public. It's ready to roll!`
    )
  )

  return 0
})

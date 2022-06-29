#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const ncp = require('copy-paste')
const webpack = require('webpack')

const linkLoaderConfigBuilder = require('@s-ui/bundler/loaders/linkLoaderConfigBuilder')
const serverConfigFactory = require('../compiler/server.js')
const {removeMarkedTags} = require('../scripts/remove-tags.js')

const BUILD_SERVER_PATH = path.join(process.cwd(), 'server')
const PUBLIC_PATH = path.join(process.cwd(), 'public')

program
  .option('-C, --clean', 'Remove build folder before create a new one')
  .option(
    '-l, --link-package [package]',
    'Replace each occurrence of this package with an absolute path to this folder',
    (v, m) => {
      m.push(v)
      return m
    },
    []
  )
  .option('-V, --verbose', 'Verbose output')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build a production ready ssr server')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-ssr build')
    console.log('')
  })
  .parse(process.argv)

const {clean, linkPackage, verbose} = program.opts()

if (clean) {
  console.log('Removing previous build...')
  rimraf.sync(BUILD_SERVER_PATH)
}

const build = () =>
  new Promise((resolve, reject) => {
    const config = serverConfigFactory({outputPath: BUILD_SERVER_PATH})
    const packagesToLink = linkPackage || []

    const nextConfig = packagesToLink.length
      ? linkLoaderConfigBuilder({
          config,
          packagesToLink
        })
      : config
    webpack(nextConfig).run((error, stats) => {
      if (error) {
        reject(error)
      }

      const jsonStats = stats.toJson()

      if (stats.hasErrors()) {
        return jsonStats.errors.map(error => console.log(error))
      }

      if (verbose && stats.hasWarnings()) {
        console.log('Webpack generated the following warnings: ')
        jsonStats.warnings.map(warning => console.log(warning))
      }

      const serverEntryPoint = jsonStats.assetsByChunkName.main[0]
      const SERVER_ENTRY_POINT = path.join(BUILD_SERVER_PATH, serverEntryPoint)

      const html = fs.readFileSync(
        path.join(PUBLIC_PATH, 'index.html'),
        'utf-8'
      )
      const htmlWithoutThirdParties = removeMarkedTags(html)
      fs.writeFileSync(
        path.join(PUBLIC_PATH, 'index_without_third_parties.html'),
        htmlWithoutThirdParties,
        'utf-8'
      )

      verbose && console.log(`Webpack stats: ${stats}`)
      console.log(`Server entry point copy to clipboard ${SERVER_ENTRY_POINT}`)
      ncp.copy(SERVER_ENTRY_POINT)

      resolve()
    })
  })
;(async () => {
  await build()
})()

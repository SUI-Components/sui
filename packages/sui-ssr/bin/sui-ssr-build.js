#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const path = require('path')
const ncp = require('copy-paste')

const serverCompilerFactory = require('../compiler/server')

const BUILD_SERVER_PATH = path.join(process.cwd(), 'server')

program
  .option('-C, --clean', 'Remove build folder before create a new one')
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

if (program.clean) {
  console.log('Removing previous build...')
  rimraf.sync(BUILD_SERVER_PATH)
}

const build = () =>
  new Promise((resolve, reject) => {
    serverCompilerFactory({outputPath: BUILD_SERVER_PATH}).run(
      (error, stats) => {
        if (error) {
          reject(error)
        }

        const jsonStats = stats.toJson()

        if (stats.hasErrors()) {
          return jsonStats.errors.map(error => console.log(error))
        }

        if (program.verbose && stats.hasWarnings()) {
          console.log('Webpack generated the following warnings: ')
          jsonStats.warnings.map(warning => console.log(warning))
        }

        const SERVER_ENTRY_POINT = path.join(
          BUILD_SERVER_PATH,
          jsonStats.assetsByChunkName.main
        )

        program.verbose && console.log(`Webpack stats: ${stats}`)
        console.log(
          `Server entry point copy to clipboard ${SERVER_ENTRY_POINT}`
        )
        ncp.copy(SERVER_ENTRY_POINT)

        resolve()
      }
    )
  })
;(async () => {
  await build()
})()

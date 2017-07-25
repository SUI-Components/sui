#!/usr/bin/env node
/* eslint-disable no-console */
// https://github.com/coryhouse/react-slingshot/blob/master/tools/build.js
const program = require('commander')
const rimraf = require('rimraf')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs-extra')
const browserSync = require('browser-sync')
const historyApiFallback = require('connect-history-api-fallback')
const config = require('../webpack.config.prod')
const {config: projectConfig} = require('../shared')

// TODO: Extract this
const chalk = require('chalk')
const chalkError = chalk.red
const chalkSuccess = chalk.green
const chalkWarning = chalk.yellow
const chalkProcessing = chalk.blue

program
  .option('-S, --server', 'server in local your production ready assets')
  .option('-C, --clean', 'Remove public folder before create a new one')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-bundler build -S')
    console.log('    $ sui-bundler build -SC')
    console.log('    $ sui-bundler build --help')
    console.log('')
  })
  .parse(process.argv)

const {server = false, clean = false} = program

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'

if (clean) {
  console.log(chalkProcessing('Removing previous build...'))
  rimraf.sync(path.resolve(process.env.PWD, 'public'))
}
console.log(chalkProcessing('Generating minified bundle. This will take a moment...'))

webpack(config).run((error, stats) => {
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

  if (projectConfig.offline && projectConfig.offline.whitelist) {
    fs.copySync(
      path.resolve(process.cwd(), 'public', 'index.html'),
      path.resolve(process.cwd(), 'public', '200.html')
    )
    console.log(chalkSuccess('200.html create to be used in your Offline App'))
  }

  console.log(chalkSuccess('Your app is compiled in production mode in /public. It\'s ready to roll!'))
  if (server) {
    console.log(chalkProcessing('Opening production build...'))
    browserSync({
      port: process.env.PORT || 4000,
      ui: {
        port: (parseInt(process.env.PORT, 10) + 1) || 4001
      },
      server: {
        baseDir: path.resolve(process.env.PWD, 'public')
      },

      files: [
        'src/*.html'
      ],

      middleware: [historyApiFallback()]
    })
  }

  return 0
})

#!/usr/bin/env node
/* eslint-disable no-console */
// https://github.com/coryhouse/react-slingshot/blob/master/tools/build.js
const program = require('commander')
const rimraf = require('rimraf')
const webpack = require('webpack')
const path = require('path')
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

  if (projectConfig.offline && projectConfig.offline.whitelist) {
    fs.copyFileSync(
      path.resolve(process.cwd(), 'public', 'index.html'),
      path.resolve(process.cwd(), 'public', '200.html')
    )
    console.log(chalkSuccess('200.html create to be used in your Offline App'))
  }

  console.log(
    chalkSuccess(
      `Your app is compiled in ${process.env.NODE_ENV} mode in /public. It's ready to roll!`
    )
  )

  return 0
})

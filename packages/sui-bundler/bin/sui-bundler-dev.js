#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander')
const path = require('path')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')

const webpackConfig = require('../webpack.config.dev')
const createCompiler = require('../factories/createCompiler')

const linkLoaderConfigBuilder = require('../loaders/linkLoaderConfigBuilder')
const log = require('../shared/log')

program
  .option('-c, --context [folder]', 'Context folder (cwd by default)')
  .option(
    '--link-all [monorepo]',
    'Link all packages inside of monorepo multipackage'
  )
  .option(
    '--link-package [package]',
    'Replace each occurrence of this package with an absolute path to this folder',
    (v, m) => {
      m.push(v)
      return m
    },
    []
  )
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-bundler dev')
    console.log('    $ sui-bundler dev --context /my/app/folder')
    console.log('    $ sui-bundler dev --link-package /my/domain/folder')
    console.log('')
  })
  .parse(process.argv)
const {context} = program
webpackConfig.context = context || webpackConfig.context

// Don't show ugly deprecation warnings that mess with the logging
process.noDeprecation = true

const start = async ({
  config = webpackConfig,
  packagesToLink = program.linkPackage || []
} = {}) => {
  clearConsole()
  // Warn and crash if required files are missing
  if (
    !checkRequiredFiles([
      path.join(config.context, 'index.html'),
      path.join(config.context, 'app.js')
    ])
  ) {
    log.error(
      `✖ Required files are missing, create and index.html and app.js inside your src folder.`
    )
    process.exit(1)
  }
  const nextConfig = linkLoaderConfigBuilder({
    config,
    linkAll: program.linkAll,
    packagesToLink
  })
  const compiler = createCompiler(nextConfig)
  compiler.watch({}, () => {})
}

start()

module.exports = start

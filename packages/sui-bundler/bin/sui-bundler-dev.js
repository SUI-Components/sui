#!/usr/bin/env node
/* eslint-disable no-console */

process.on('unhandledRejection', err => {
  throw err
})

const pkg = require('../package')
const program = require('commander')
const checkForUpdate = require('update-check')
const path = require('path')
const chalk = require('chalk')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const {
  choosePort,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils')
const webpackConfig = require('../webpack.config.dev')
const createDevServerConfig = require('../factories/createDevServerConfig')
const createCompiler = require('../factories/createCompiler')
const preloadRemover = require('../loaders/preLoadRemover')

const linkLoaderConfigBuilder = require('../loaders/linkLoaderConfigBuilder')

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'
let update = null

if (!module.parent) {
  program
    .option('-c, --context [folder]', 'Context folder (cwd by default)')
    .option(
      '--link-package [package]',
      'Replace each occurrence of this package with an absolute path to this folder',
      (v, m) => {
        m.push(v)
        return m
      },
      []
    )
    .option('--no-pre-loader', 'Does not execute any pre enforced loaded')
    .on('--help', () => {
      console.log('  Examples:')
      console.log('')
      console.log('    $ sui-bundler dev')
      console.log('    $ sui-bundler dev --context /my/app/folder')
      console.log('    $ sui-bundler dev --link-package /my/domain/folder')
      console.log('    $ sui-bundler dev --no-pre-loader')
      console.log('')
    })
    .parse(process.argv)
  const {context} = program
  webpackConfig.context = context || webpackConfig.context
}

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
    console.error(
      `Required files are missing, create and index.html and app.js inside your src folder.`
    )
    process.exit(1)
  }
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const port = await choosePort(HOST, DEFAULT_PORT)
  const urls = prepareUrls(protocol, HOST, port)
  const nextConfig = linkLoaderConfigBuilder({
    config: preloadRemover({config, preLoader: program.preLoader}),
    packagesToLink
  })
  const compiler = createCompiler(nextConfig, urls)
  const serverConfig = createDevServerConfig(nextConfig, urls.lanUrlForConfig)
  const devServer = new WebpackDevServer(compiler, serverConfig)
  console.log(chalk.cyan('Starting the development server...\n'))
  devServer.listen(port, HOST, err => {
    if (err) {
      return console.log(err)
    }
    ;['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close()
        process.exit()
      })
    })
  })

  try {
    update = await checkForUpdate(pkg)
  } catch (err) {
    console.error(`Failed to check for updates: ${err}`)
  }

  if (update) {
    console.log(
      chalk.gray(
        `The latest version of ${require('../package.json').name} is ${
          update.latest
        }. Please update!`
      )
    )
  }
}

if (!module.parent) {
  start()
}

module.exports = start

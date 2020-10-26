#!/usr/bin/env node
/* eslint-disable no-console */

process.on('unhandledRejection', err => {
  throw err
})

const program = require('commander')
const path = require('path')
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

const linkLoaderConfigBuilder = require('../loaders/linkLoaderConfigBuilder')
const log = require('../shared/log')

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

if (!module.parent) {
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
    log.error(
      `✖ Required files are missing, create and index.html and app.js inside your src folder.`
    )
    process.exit(1)
  }
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const port = await choosePort(HOST, DEFAULT_PORT)
  const urls = prepareUrls(protocol, HOST, port)
  const nextConfig = linkLoaderConfigBuilder({
    config,
    linkAll: program.linkAll,
    packagesToLink
  })
  const compiler = createCompiler(nextConfig, urls)
  const serverConfig = createDevServerConfig(nextConfig, urls.lanUrlForConfig)
  const devServer = new WebpackDevServer(compiler, serverConfig)
  log.processing('❯ Starting the development server...\n')
  devServer.listen(port, HOST, err => {
    if (err) return log.error(err)
    ;['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => {
        devServer.close()
        process.exit()
      })
    })
  })
}

if (!module.parent) {
  start()
}

module.exports = start

#!/usr/bin/env node
/* eslint-disable no-console */

process.on('unhandledRejection', err => {
  throw err
})

const program = require('commander')
const path = require('path')
const WebpackDevServer = require('webpack-dev-server')

const clearConsole = require('../utils/clearConsole')
const checkRequiredFiles = require('../utils/checkRequiredFiles')
const {
  choosePort,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils')

const webpackConfig = require('../webpack.config.dev')

const createDevServerConfig = require('../factories/createDevServerConfig')
const createCompiler = require('../factories/createCompiler')

const linkLoaderConfigBuilder = require('../loaders/linkLoaderConfigBuilder')
const log = require('../shared/log')

const {CI = false, HOST = '0.0.0.0', HTTPS, PORT} = process.env
const DEFAULT_PORT = +PORT || 3000
const DEFAULT_WATCH = !CI

if (!module.parent) {
  program
    .option('-c, --context [folder]', 'Context folder (cwd by default)')
    .option(
      '-L, --link-all [monorepo]',
      'Link all packages inside of monorepo multipackage'
    )
    .option(
      '-l, --link-package [package]',
      'Replace each occurrence of this package with an absolute path to this folder',
      (v, m) => {
        m.push(v)
        return m
      },
      []
    )
    .option(
      '-w, --watch',
      'Watch files and restart the server on change',
      DEFAULT_WATCH
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

  const {context} = program.opts()

  webpackConfig.context = context || webpackConfig.context
}

const start = async ({
  config = webpackConfig,
  packagesToLink = program.opts().linkPackage || []
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

  const protocol = HTTPS === 'true' ? 'https' : 'http'
  const port = await choosePort(HOST, DEFAULT_PORT)
  const urls = prepareUrls(protocol, HOST, port)
  const nextConfig = linkLoaderConfigBuilder({
    config,
    linkAll: program.opts().linkAll,
    packagesToLink
  })

  const compiler = createCompiler(nextConfig, urls)
  const serverConfig = createDevServerConfig(nextConfig, urls.lanUrlForConfig)
  const devServer = new WebpackDevServer(
    {
      ...serverConfig,
      port,
      host: HOST
    },
    compiler
  )

  log.processing('❯ Starting the development server...\n')
  devServer.startCallback(err => {
    if (err) return log.error(err)
    ;['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => {
        devServer.stop()
        process.exit()
      })
    })
  })
}

if (!module.parent) {
  start()
}

module.exports = start

#!/usr/bin/env node
/* eslint-disable no-console */
// https://github.com/coryhouse/react-slingshot/blob/master/tools/srcServer.js
const historyApiFallback = require('connect-history-api-fallback')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const ncp = require('copy-paste')
const detect = require('detect-port')
const ora = require('ora')
const app = require('express')()

const config = require('../webpack.config.dev')
const bundler = webpack(config)

console.log('📦  Bundler Dev Server')

// Don't show ugly deprecation warnings that mess with the logging
process.noDeprecation = true

function getPortAvailable ({ port }) {
  const spinner = ora(`Checking if port ${port} is available...`).start()
  return new Promise((resolve, reject) => {
    /* eslint-disable prefer-promise-reject-errors */
    detect(port, (err, suggestedPort) => {
      if (err) {
        return reject({ err })
      }

      if (port === suggestedPort) {
        spinner.succeed(`Port ${port} is free for using it`)
        return resolve({ port })
      }

      spinner.warn(`Port ${port} is busy, using available port: ${suggestedPort}`)
      return resolve({ port: suggestedPort })
    })
  })
}

function listenBundlerEvents ({ bundler, spinner }) {
  bundler.plugin('compile', _ => spinner.start(`Building bundle with Webpack`))
  bundler.plugin('done', stats => {
    const info = stats.toJson()

    if (stats.hasErrors()) {
      spinner.fail('Build failed')
      info.errors.forEach(console.error)
    } else if (stats.hasWarnings()) {
      spinner.info('Build succeeded with warnings')
      info.warnings.forEach(console.warn)
    } else {
      spinner.succeed('Build succeed!')
    }

    spinner.info('Waiting for new changes...')
  })
}

function initializeDevServer ({ port }) {
  const spinner = ora(`Initialize Dev Server on port ${port}`).start()
  const webpackDevMiddlewareInstance = webpackDevMiddleware(bundler, {
    hot: true,
    noInfo: true,
    overlay: true,
    publicPath: config.output.publicPath,
    quiet: true,
    stats: false
  })

  const webpackHotMiddlewareInstance = webpackHotMiddleware(bundler, {
    log: false,
    noInfo: true,
    overlay: true,
    quiet: true
  })

  app.use(
    historyApiFallback(),
    webpackDevMiddlewareInstance,
    webpackHotMiddlewareInstance
  )

  app.listen(port, () => {
    ncp.copy(`http://localhost:${port}`)
    spinner
      .succeed(`Server started successfully`)
      .info(`Copied url to clipboard: http://localhost:${port}`)
      .start(`Building bundle with Webpack`)
  })

  listenBundlerEvents({ bundler, spinner })
}

const port = process.env.PORT || 3000
getPortAvailable({ port })
  .then(initializeDevServer)
  .catch(err => console.error(err))

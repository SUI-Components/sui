#!/usr/bin/env node
/* eslint-disable no-console */

const {WEBPACK_PORT = 8080} = process.env
process.env.CDN = `http://localhost:${WEBPACK_PORT}/`

const program = require('commander')
const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const nodemon = require('nodemon')
const clientConfig = require('@s-ui/bundler/webpack.config.server.dev.js')
const linkLoaderConfigBuilder = require('@s-ui/bundler/loaders/linkLoaderConfigBuilder.js')

const serverConfigFactory = require('../compiler/server.js')

const SERVER_OUTPUT_PATH = path.join(process.cwd(), '.sui/server')
const STATICS_OUTPUT_PATH = path.join(process.cwd(), '.sui/statics')
const STATICS_PATH = path.join(process.cwd(), './statics')

program
  .option('-L, --link-all [monorepo]', 'Link all packages inside of monorepo multipackage')
  .option(
    '-l, --link-package [package]',
    'Replace each occurrence of this package with an absolute path to this folder',
    (v, m) => {
      m.push(v)
      return m
    },
    []
  )
  .parse(process.argv)

const compile = (name, compiler) => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      console.time(`[${name}] Compiling`)
    })
    compiler.hooks.done.tap(name, stats => {
      console.timeEnd(`[${name}] Compiling`)
      if (!stats.hasErrors()) {
        return resolve()
      }
      return reject(new Error(`Failed to compile ${name}`))
    })
  })
}

const linkStatics = () => {
  return new Promise((resolve, reject) =>
    fs.symlink(STATICS_PATH, STATICS_OUTPUT_PATH, 'dir', err => {
      if (err) {
        if (err.code === 'EEXIST') {
          return resolve()
        }

        return reject(err)
      }

      resolve()
    })
  )
}

const initMSW = () => {
  return exec(`npx msw init ${STATICS_PATH}`)
}

const start = ({packagesToLink, linkAll}) => {
  const app = express()
  const clientCompiler = webpack(
    linkLoaderConfigBuilder({
      config: require('@s-ui/bundler/webpack.config.server.dev.js'),
      linkAll,
      packagesToLink
    })
  )
  const serverCompiler = webpack(
    linkLoaderConfigBuilder({
      config: serverConfigFactory({outputPath: SERVER_OUTPUT_PATH}),
      linkAll,
      packagesToLink
    })
  )
  const watchOptions = {
    ignored: /node_modules/,
    stats: clientConfig.stats
  }

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    return next()
  })

  app.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      stats: clientConfig.stats,
      writeToDisk: true
    })
  )
  app.use(webpackHotMiddleware(clientCompiler))

  app.listen(WEBPACK_PORT)

  serverCompiler.watch(watchOptions, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      return
    }

    if (error) {
      console.log(error, 'error')
    }

    if (stats.hasErrors()) {
      const info = stats.toJson()
      const errors = info.errors

      console.log(errors)
    }
  })

  Promise.all([linkStatics(), initMSW(), compile('client', clientCompiler), compile('server', serverCompiler)])
    .then(() => {
      const script = nodemon({
        script: `${SERVER_OUTPUT_PATH}/index.js`,
        watch: [SERVER_OUTPUT_PATH],
        delay: 200
      })

      script.on('restart', () => {
        console.log('Server side app has been restarted.', 'warning')
      })

      script.on('quit', () => {
        console.log('Process ended')
        process.exit()
      })

      script.on('error', () => {
        console.log('An error occured. Exiting', 'error')
        process.exit(1)
      })
    })
    .catch(error => {
      console.log('error', error)
    })
}
const opts = program.opts()

start({packagesToLink: opts.linkPackage, linkAll: opts.linkAll})

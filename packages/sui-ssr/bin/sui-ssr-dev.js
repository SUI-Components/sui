#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander')
const {exec} = require('child_process')
const {cp} = require('fs/promises')
const path = require('path')
const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const nodemon = require('nodemon')
const {performance} = require('perf_hooks')
const linkLoaderConfigBuilder = require('@s-ui/bundler/loaders/linkLoaderConfigBuilder.js')
const clearConsole = require('@s-ui/bundler/utils/clearConsole.js')
const {choosePort, prepareUrls, printInstructions} = require('@s-ui/bundler/utils/WebpackDevServerUtils.js')
const log = require('@s-ui/bundler/shared/log.js')

const serverConfigFactory = require('../compiler/server.js')

const TMP_PATH = '.sui'
const SRC_PATH = path.join(process.cwd(), 'src')
const PUBLIC_OUTPUT_PATH = path.join(process.cwd(), `${TMP_PATH}/public`)
const SERVER_OUTPUT_PATH = path.join(process.cwd(), `${TMP_PATH}/server`)
const STATICS_PATH = path.join(process.cwd(), './statics')
const STATICS_OUTPUT_PATH = path.join(process.cwd(), `${TMP_PATH}/statics`)

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
    compiler.hooks.done.tap(name, stats => {
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

const copyStatics = () => {
  return Promise.allSettled([
    cp(path.join(SRC_PATH, '404.html'), path.join(PUBLIC_OUTPUT_PATH, '404.html'), {recursive: true}),
    cp(path.join(SRC_PATH, '500.html'), path.join(PUBLIC_OUTPUT_PATH, '500.html'), {recursive: true})
  ])
}

const initMSW = () => {
  return exec(`npx msw init ${STATICS_PATH}`)
}

const start = async ({packagesToLink, linkAll}) => {
  clearConsole()

  const start = performance.now()
  const {WEBPACK_PORT = 8080, PORT = 3000, HOST = '0.0.0.0', CDN = 'http://localhost'} = process.env
  const port = await choosePort(PORT)
  const webpackPort = await choosePort(WEBPACK_PORT)
  const urls = prepareUrls('http', HOST, port)
  const cdn = `${CDN}:${webpackPort}/`

  process.env.PORT = port
  process.env.CDN = cdn
  process.env.DEV_SERVER = 'true'

  const configVars = JSON.stringify({packagesToLink, linkAll})
  const clientConfig = require('@s-ui/bundler/webpack.config.client.dev.js')
  const serverConfig = serverConfigFactory({outputPath: SERVER_OUTPUT_PATH})

  const version = `${__dirname}|${configVars}`

  clientConfig.cache.version = version
  serverConfig.cache.version = version

  const clientCompiler = webpack(
    linkLoaderConfigBuilder({
      config: clientConfig,
      linkAll,
      packagesToLink
    })
  )

  const serverCompiler = webpack(
    linkLoaderConfigBuilder({
      config: serverConfig,
      linkAll,
      packagesToLink
    })
  )

  log.processing('❯ Starting the development server...\n')

  const app = express()

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

  app.listen(webpackPort)

  serverCompiler.watch(
    {
      ignored: /node_modules/,
      stats: clientConfig.stats
    },
    (error, stats) => {
      if (!error && !stats.hasErrors()) {
        return
      }

      if (error) {
        console.error(error)
      }

      if (stats.hasErrors()) {
        const info = stats.toJson()
        const errors = info.errors

        console.log(errors)
      }
    }
  )

  if (!fs.existsSync(TMP_PATH)) {
    fs.mkdirSync(TMP_PATH)
  }

  Promise.all([
    linkStatics(),
    initMSW(),
    copyStatics(),
    compile('client', clientCompiler),
    compile('server', serverCompiler)
  ])
    .then(() => {
      const script = nodemon({
        script: `${SERVER_OUTPUT_PATH}/index.js`,
        args: [HOST],
        watch: [SERVER_OUTPUT_PATH],
        nodeArgs: '--inspect',
        delay: 200
      })
      let isFirstStart = true

      script.on('start', () => {
        if (!isFirstStart) {
          return
        }

        isFirstStart = false

        const end = performance.now()

        const time = end - start
        const msg = time > 2000 ? `${Math.round(time / 100) / 10}s` : `${time}ms`

        clearConsole()
        log.success(`✓ Started successfully in ${msg}\n`)
        printInstructions({urls})
      })

      script.on('quit', () => {
        process.exit()
      })

      script.on('error', () => {
        process.exit(1)
      })
    })
    .catch(error => {
      console.error(error)
    })
}
const opts = program.opts()

start({packagesToLink: opts.linkPackage, linkAll: opts.linkAll})

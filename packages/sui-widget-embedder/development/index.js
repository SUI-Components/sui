const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')

const app = express()

module.exports = ({address, page, config}) => {
  const compiler = require('../compiler/development')({
    address,
    page,
    port: config.port
  })

  app.use(
    webpackMiddleware(compiler, {
      serverSideRender: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      noInfo: true
    })
  )

  app.use(webpackHotMiddleware(compiler, {path: '/__ping'}))

  return app
}

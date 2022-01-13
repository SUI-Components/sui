const webpackMiddleware = require('webpack-dev-middleware')
const express = require('express')

const app = express()

module.exports = ({address, browser, page, config}) => {
  const compiler = require('../compiler/development')({
    address,
    browser,
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

  return app
}

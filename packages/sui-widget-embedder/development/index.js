const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')

const app = express()

module.exports = ({page, pathnameStatic, config}) => {
  const compiler = require('../compiler/development')({page, port: config.port})
  const proxy = require('./proxy')(config)
  app.use(webpackMiddleware(compiler, {serverSideRender: true}))
  app.use(webpackHotMiddleware(compiler, {path: '/__ping'}))

  pathnameStatic
    ? app.get('/static', (req, res) => {
        const request = require('request')
        const replace = require('stream-replace')
        request({
          uri: `${config.target}${pathnameStatic}`,
          headers: config.headers
        })
      .pipe(replace(/\<\/body\>/, '<script async src="/bundle.js"></script></body>')) // eslint-disable-line
          .pipe(res)
      })
    : app.use(require('./harmon'))

  app.use((req, res) => {
    proxy.web(req, res, {target: config.target})
  })
  return app
}

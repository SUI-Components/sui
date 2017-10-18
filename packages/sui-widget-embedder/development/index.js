/* eslint-disable */
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')

const raw = require('./replace-middleware')
const proxy = require('./proxy')

const app = express()

module.exports = ({page, config}) => {
  const compiler = require('../compiler/development')({page})
  app.use(webpackMiddleware(compiler, {serverSideRender: true}))
  app.use(webpackHotMiddleware(compiler, {path: '/__ping'}))

  app.use(raw, (req, res) => {
    proxy.web(req, res, {target: config.target})
  })
  return app
}

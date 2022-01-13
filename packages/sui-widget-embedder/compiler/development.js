const path = require('path')
const webpack = require('webpack')
const devConfig = require('@s-ui/bundler/webpack.config.dev')
const {pipe, removePlugin} = require('./utils')

module.exports = ({address, browser = false, page, port}) => {
  const config = {
    ...devConfig,
    context: path.resolve(process.cwd(), 'pages', page),
    entry: [`./index.js`],
    optimization: {
      ...devConfig.optimization,
      runtimeChunk: false
    },
    output: {
      path: '/',
      publicPath: `http://${address}:${port}/`,
      filename: 'bundle.js',
      jsonpFunction: `webpackJsonp-${page}-dev`
    }
  }

  if (!browser) {
    config.plugins = pipe(removePlugin('HtmlWebpackPlugin'))(devConfig.plugins)
  }

  return webpack(config)
}

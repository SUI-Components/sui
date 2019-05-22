const webpack = require('webpack')
const {cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared')
const JsMinimizer = require('./shared/js-minimizer')
const definePlugin = require('./shared/define')
const babelRules = require('./shared/module-rules-babel')
require('./shared/shims')

module.exports = {
  mode: 'production',
  resolve: {
    alias: config.alias,
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: config.vendor
    ? {
        app: MAIN_ENTRY_POINT,
        vendor: config.vendor
      }
    : MAIN_ENTRY_POINT,
  target: 'web',
  output: {
    jsonpFunction: 'suiWebpackJsonp',
    chunkFilename: '[name].[chunkhash:8].js',
    filename: 'index.js'
  },
  optimization: {
    minimizer: [JsMinimizer()]
  },
  plugins: cleanList([
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin()
  ]),
  module: {
    rules: [babelRules()]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

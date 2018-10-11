const webpack = require('webpack')
const {cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared')
const uglifyJsPlugin = require('./shared/uglify')
const definePlugin = require('./shared/define')
const babelRules = require('./shared/module-rules-babel')
require('./shared/shims')

module.exports = {
  mode: 'production',
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: config.vendor
    ? {
        app: MAIN_ENTRY_POINT,
        jsonpFunction: 'suiWebpackJsonp',
        vendor: config.vendor
      }
    : MAIN_ENTRY_POINT,
  target: 'web',
  output: {
    chunkFilename: '[name].[chunkhash:8].js',
    filename: 'index.js'
  },
  optimization: {
    minimizer: [uglifyJsPlugin]
  },
  plugins: cleanList([
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin()
  ]),
  module: {
    rules: [babelRules]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

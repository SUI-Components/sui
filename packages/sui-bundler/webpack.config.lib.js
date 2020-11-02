const webpack = require('webpack')
const {cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared/index')
const minifyJs = require('./shared/minify-js')
const definePlugin = require('./shared/define')
const babelRules = require('./shared/module-rules-babel')
const {extractComments, sourceMap} = require('./shared/config')
const {aliasFromConfig} = require('./shared/resolve-alias')

module.exports = {
  mode: 'production',
  resolve: {
    alias: {
      ...aliasFromConfig
    },
    extensions: ['.js', '.json']
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
    filename: 'index.js'
  },
  optimization: {
    // avoid looping over all the modules after the compilation
    checkWasmTypes: false,
    minimizer: [minifyJs({extractComments, sourceMap})]
  },
  plugins: cleanList([
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
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

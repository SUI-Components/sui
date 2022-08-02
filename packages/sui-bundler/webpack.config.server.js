const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')

const {config, when, cleanList} = require('./shared/index.js')
const createBabelRules = require('./shared/module-rules-babel.js')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader.js')
const {aliasFromConfig} = require('./shared/resolve-alias.js')
const {resolveLoader} = require('./shared/resolve-loader.js')

const filename = '[name].[chunkhash:8].js'

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type {WebpackConfig} */
const webpackConfig = {
  context: path.resolve(process.cwd(), 'src'),
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    alias: {...aliasFromConfig},
    extensions: ['.js', '.json'],
    modules: ['node_modules', path.resolve(process.cwd())]
  },
  entry: './server.js',
  target: 'node',
  output: {
    chunkFilename: filename,
    filename,
    path: path.resolve(process.cwd(), 'build'),
    pathinfo: false
  },
  optimization: {
    checkWasmTypes: false,
    minimize: true,
    nodeEnv: false
  },
  externals: [webpackNodeExternals()],
  plugins: [new webpack.DefinePlugin({'global.GENTLY': false})],
  resolveLoader,
  module: {
    rules: cleanList([
      createBabelRules({isServer: true}),
      {
        // ignore css/scss/svg require/imports files in the server
        test: /(\.svg|\.s?css)$/,
        type: 'asset/inline',
        generator: {
          dataUrl: () => ''
        }
      },
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  }
}

module.exports = webpackConfig

const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')
const babelRules = require('./shared/module-rules-babel')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')
const {aliasFromConfig} = require('./shared/resolve-alias')

const {config, when, cleanList} = require('./shared')
const {resolveLoader} = require('./shared/resolve-loader')

const filename = '[name].[chunkhash:8].js'

const webpackConfig = {
  context: path.resolve(process.cwd(), 'src'),
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    alias: {...aliasFromConfig},
    extensions: ['.js', '.json']
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
    nodeEnv: false
  },
  externals: [webpackNodeExternals()],
  plugins: [new webpack.DefinePlugin({'global.GENTLY': false})],
  resolveLoader,
  module: {
    rules: cleanList([
      babelRules,
      {
        // ignore css/scss require/imports files in the server
        test: /\.s?css$/,
        use: 'null-loader'
      },
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  }
}

module.exports = webpackConfig

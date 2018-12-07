const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')
const babelRules = require('./shared/module-rules-babel')
const {config} = require('./shared')

let webpackConfig = {
  context: path.resolve(process.cwd(), 'src'),
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    alias: config.alias,
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: './server.js',
  target: 'node',
  output: {
    path: path.resolve(process.cwd(), 'build'),
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].[chunkhash:8].js'
  },
  optimization: {
    nodeEnv: false
  },
  externals: [webpackNodeExternals()],
  plugins: [new webpack.DefinePlugin({'global.GENTLY': false})],
  module: {
    rules: [
      babelRules,
      {
        // ignore scss require/imports files in the server
        test: /\.scss$/,
        use: ['null-loader']
      }
    ]
  }
}

module.exports = webpackConfig

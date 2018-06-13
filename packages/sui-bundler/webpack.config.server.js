const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')
const babelRules = require('./shared/module-rules-babel')

let webpackConfig = {
  context: path.resolve(process.cwd(), 'src'),
  resolve: {extensions: ['*', '.js', '.jsx', '.json']},
  entry: './server.js',
  target: 'node',
  output: {
    path: path.resolve(process.cwd(), 'build'),
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].[chunkhash:8].js'
  },
  externals: [webpackNodeExternals()],
  plugins: [new webpack.DefinePlugin({'global.GENTLY': false})],
  module: {
    rules: [babelRules]
  }
}

module.exports = webpackConfig

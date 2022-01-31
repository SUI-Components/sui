'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cssLoader = require.resolve('css-loader')

const loader = require.resolve('../../../..')

module.exports = {
  mode: 'production',
  context: path.join(__dirname),
  entry: {
    index: './index.scss'
  },
  output: {
    path: path.join(__dirname, '../../runtime/with-resolve-modules'),
    filename: '[name].js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src/components'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, cssLoader, loader]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
}

'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cssLoader = require.resolve('css-loader')

const loader = require.resolve('../../..')

module.exports = {
  mode: 'development',
  stats: 'errors-only',
  context: path.join(__dirname),
  entry: {
    index: './index.scss'
  },
  output: {
    path: path.join(__dirname, '../../runtime/withSass'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          cssLoader,
          {
            loader: loader,
            options: {
              implementation: require('sass')
            }
          }
        ]
      },
      {
        type: 'asset/resource',
        test: /\.png$/
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
}

'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cssLoader = require.resolve('css-loader')

const loader = require.resolve('../../../..')

module.exports = {
  mode: 'production',
  context: path.join(__dirname),
  entry: {
    index: './actual/index.scss'
  },
  output: {
    path: path.join(__dirname, '../../runtime/avoid-colision-same-node-module'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,

        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: cssLoader,
            options: {
              url: false
            }
          },
          {
            loader: loader,
            options: {
              resolveURLs: false
            }
          }
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
}

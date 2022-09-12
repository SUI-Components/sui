'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cssLoader = require.resolve('css-loader')

const loader = require.resolve('../../../..')

module.exports = {
  mode: 'production',
  context: path.join(__dirname),
  entry: {
    index: './actual/index.scss',
    index2: './actual/index2.sass'
  },
  output: {
    path: path.join(__dirname, '../../runtime/normal-no-url-resolve'),
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
            loader,
            options: {
              includePaths: [path.join(__dirname, 'extra'), 'sass_modules'],
              resolveURLs: false
            }
          }
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
}

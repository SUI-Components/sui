const path = require('path')
const webpack = require('webpack')
const devConfig = require('@s-ui/bundler/webpack.config.dev')
const {pipe, removePlugin} = require('./utils')

module.exports = ({page, port}) =>
  webpack({
    ...devConfig,
    context: path.resolve(process.cwd(), 'widgets', page),
    entry: [
      `webpack-hot-middleware/client?path=http://localhost:${port}/__ping`,
      `./index.js`
    ],
    output: {
      path: '/',
      publicPath: `http://localhost:${port}/`,
      filename: 'bundle.js'
    },
    plugins: pipe(removePlugin('HtmlWebpackPlugin'))(devConfig.plugins)
  })

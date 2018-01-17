const path = require('path')
const webpack = require('webpack')
const devConfig = require('@s-ui/bundler/webpack.config.dev')

const htmlPluginPosition = devConfig.plugins
  .map(p => p.constructor.toString())
  .findIndex(string => string.match(/HtmlWebpackPlugin/))

module.exports = ({page}) => webpack({
  ...devConfig,
  context: path.resolve(process.cwd(), 'widgets', page),
  entry: [
    'webpack-hot-middleware/client?path=/__ping',
    `./index.js`
  ],
  output: {
    path: '/',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    ...devConfig.plugins.slice(0, htmlPluginPosition),
    ...devConfig.plugins.slice(htmlPluginPosition + 1)
  ]
})

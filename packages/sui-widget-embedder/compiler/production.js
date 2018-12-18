const path = require('path')
const webpack = require('webpack')
const prodConfig = require('@s-ui/bundler/webpack.config.prod')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const uglifyJsPlugin = require('@s-ui/bundler/shared/uglify')
const {pipe, removePlugin} = require('./utils')
const MAIN_ENTRY_POINT = './index.js'

const requireOrDefault = path => {
  try {
    return require(path)
  } catch (e) {
    return {}
  }
}

module.exports = ({page, remoteCdn, globalConfig = {}}) => {
  const config = requireOrDefault(
    path.resolve(process.cwd(), 'pages', page, 'package')
  )

  const entry = {app: MAIN_ENTRY_POINT}
  if (config.vendor) {
    entry['vendor'] = config.vendor
  }
  return webpack({
    ...prodConfig,
    context: path.resolve(process.cwd(), 'pages', page),
    resolve: {
      ...prodConfig.resolve,
      alias: globalConfig.alias
    },
    entry,
    output: {
      ...prodConfig.output,
      path: path.resolve(process.cwd(), 'public', page),
      publicPath: remoteCdn
        ? `${remoteCdn}/${page}/`
        : prodConfig.output.publicPath,
      jsonpFunction: `webpackJsonp-${page}`
    },
    optimization: {
      ...prodConfig.optimization,
      minimizer: [
        uglifyJsPlugin,
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            zindex: false
          }
        })
      ]
    },
    plugins: pipe(
      removePlugin('HtmlWebpackPlugin'),
      removePlugin('ScriptExtHtmlWebpackPlugin'),
      removePlugin('PreloadWebpackPlugin')
    )(prodConfig.plugins)
  })
}

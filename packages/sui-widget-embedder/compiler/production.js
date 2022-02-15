// @ts-check

const path = require('path')
const webpack = require('webpack')

const prodConfig = require('@s-ui/bundler/webpack.config.prod')
const {pipe, removePlugin} = require('./utils.js')

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
    entry.vendor = config.vendor
  }

  /** @typedef {import('webpack').Configuration} WebpackConfig */

  /** @type {WebpackConfig} */
  const webpackConfig = {
    ...prodConfig,
    context: path.resolve(process.cwd(), 'pages', page),
    resolve: {
      ...prodConfig.resolve,
      alias: globalConfig.alias
    },
    entry,
    optimization: {
      ...prodConfig.optimization,
      splitChunks: false
    },
    output: {
      ...prodConfig.output,
      path: path.resolve(process.cwd(), 'public', page),
      publicPath: remoteCdn
        ? `${remoteCdn}/${page}/`
        : prodConfig.output.publicPath,
      chunkLoadingGlobal: `webpackJsonp-${page}`
    },
    plugins: pipe(removePlugin('HtmlWebpackPlugin'))(prodConfig.plugins)
  }

  return webpack(webpackConfig)
}

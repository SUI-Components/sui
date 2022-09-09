// @ts-check

/* eslint-disable no-console */
const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {WebpackManifestPlugin} = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineChunkHtmlPlugin = require('./shared/inline-chunk-html-plugin.js')

const {
  when,
  cleanList,
  envVars,
  MAIN_ENTRY_POINT,
  config
} = require('./shared/index.js')
const {aliasFromConfig} = require('./shared/resolve-alias.js')
const {
  extractComments,
  sourceMap,
  supportLegacyBrowsers
} = require('./shared/config.js')
const {resolveLoader} = require('./shared/resolve-loader.js')
const createBabelRules = require('./shared/module-rules-babel.js')
const sassRules = require('./shared/module-rules-sass.js')
const definePlugin = require('./shared/define.js')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader.js')
const minifyCss = require('./shared/minify-css.js')
const minifyJs = require('./shared/minify-js.js')

const CWD = process.cwd()
const PUBLIC_PATH = process.env.CDN || config.cdn || '/'
const PWD = process.env.PWD ?? ''

const filename = config.onlyHash
  ? '[contenthash:8].js'
  : '[name].[contenthash:8].js'

const cssFileName = config.onlyHash
  ? '[contenthash:8].css'
  : '[name].[contenthash:8].css'

const target = supportLegacyBrowsers ? ['web', 'es5'] : 'web'

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type {WebpackConfig} */
const webpackConfig = {
  devtool: sourceMap,
  mode: 'production',
  target,
  context: path.resolve(CWD, 'src'),
  resolve: {
    alias: {...aliasFromConfig},
    extensions: ['.js', '.json'],
    modules: ['node_modules', path.resolve(CWD)],
    fallback: {
      assert: false,
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      path: false
    }
  },
  entry: MAIN_ENTRY_POINT,
  output: {
    chunkFilename: filename,
    filename,
    path: path.resolve(PWD, 'public'),
    publicPath: PUBLIC_PATH
  },
  optimization: {
    checkWasmTypes: false,
    minimize: true,
    minimizer: [minifyJs({extractComments, sourceMap}), minifyCss()].filter(
      Boolean
    ),
    runtimeChunk: true
  },
  plugins: cleanList([
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.ids.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin(),
    new MiniCssExtractPlugin({
      filename: cssFileName,
      chunkFilename: cssFileName
    }),
    new HtmlWebpackPlugin({
      env: process.env,
      inject: 'head',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyURLs: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      scriptLoading: 'defer',
      template: './index.html'
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
    new WebpackManifestPlugin({fileName: 'asset-manifest.json'})
  ]),
  module: {
    rules: cleanList([
      createBabelRules(),
      sassRules,
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  },
  resolveLoader
}

module.exports = webpackConfig

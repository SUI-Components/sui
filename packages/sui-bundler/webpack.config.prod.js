// @ts-check

/* eslint-disable no-console */
const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {WebpackManifestPlugin} = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineChunkHtmlPlugin = require('./shared/inline-chunk-html-plugin.js')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const {
  when,
  cleanList,
  envVars,
  MAIN_ENTRY_POINT,
  config
} = require('./shared/index')
const minifyJs = require('./shared/minify-js')
const minifyCss = require('./shared/minify-css')
const definePlugin = require('./shared/define')
const babelRules = require('./shared/module-rules-babel')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')
const {
  extractComments,
  useExperimentalMinifier,
  sourceMap
} = require('./shared/config')
const {aliasFromConfig} = require('./shared/resolve-alias')
const {resolveLoader} = require('./shared/resolve-loader')

const PUBLIC_PATH = process.env.CDN || config.cdn || '/'

const filename = config.onlyHash
  ? '[contenthash:8].js'
  : '[name].[contenthash:8].js'

const cssFileName = config.onlyHash
  ? '[contenthash:8].css'
  : '[name].[contenthash:8].css'

const smp = new SpeedMeasurePlugin()

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type {WebpackConfig} */
const webpackConfig = {
  devtool: sourceMap,
  mode: 'production',
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    alias: {...aliasFromConfig},
    extensions: ['.js', '.json'],
    modules: ['node_modules', path.resolve(process.cwd())]
  },
  entry: config.vendor
    ? {
        app: MAIN_ENTRY_POINT,
        vendor: config.vendor
      }
    : MAIN_ENTRY_POINT,
  target: 'web',
  output: {
    chunkFilename: filename,
    filename,
    path: path.resolve(process.env.PWD, 'public'),
    publicPath: PUBLIC_PATH
  },
  optimization: {
    minimize: true,
    minimizer: [
      minifyJs({useExperimentalMinifier, extractComments, sourceMap}),
      minifyCss()
    ].filter(Boolean),
    runtimeChunk: true
  },
  plugins: cleanList([
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
      babelRules,
      {
        test: /(\.css|\.scss)$/,
        use: cleanList([
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          when(config['externals-manifest'], () => ({
            loader: 'externals-manifest-loader',
            options: {
              manifestURL: config['externals-manifest']
            }
          })),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')({
                    overrideBrowserslist: config.targets
                  })
                ]
              }
            }
          },
          require.resolve('sass-loader')
        ])
      },
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  },
  resolveLoader,
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

module.exports = config.measure ? smp.wrap(webpackConfig) : webpackConfig

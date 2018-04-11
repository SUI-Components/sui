/* eslint-disable no-console */
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const Externals = require('./plugins/externals')
const path = require('path')

const {when, cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared')
const {navigateFallbackWhitelist, navigateFallback, runtimeCaching, directoryIndex} = require('./shared/precache')
require('./shared/shims')

// hack for Windows, as process.env.PWD is undefined in that environment
// https://github.com/mrblueblue/gettext-loader/issues/18
if (process.env.PWD === undefined) {
  process.env.PWD = process.cwd()
}

module.exports = {
  mode: 'production',
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: config.vendor ? {
    app: MAIN_ENTRY_POINT,
    vendor: config.vendor
  } : MAIN_ENTRY_POINT,
  target: 'web',
  output: {
    path: path.resolve(process.env.PWD, 'public'),
    publicPath: process.env.CDN || config.cdn || '/',
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].[chunkhash:8].js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: cleanList([
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    new webpack.DefinePlugin({
      __DEV__: false,
      __BASE_DIR__: JSON.stringify(process.env.PWD)
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css'
    }),
    new HtmlWebpackPlugin({
      env: process.env,
      inject: 'head',
      template: './index.html',
      trackJSToken: '',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyURLs: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
      inline: 'runtime',
      ...config.scripts
    }),
    new PreloadWebpackPlugin({ rel: 'prefetch' }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    when(config.offline, () => new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger (message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return
        }
        console.log(message)
      },
      minify: true,
      directoryIndex: (
        console.log('directoryIndex', directoryIndex(config.offline.whitelist)),
        directoryIndex(config.offline.whitelist)
      ),
      navigateFallback: (
        console.log('navigateFallback', navigateFallback(config.offline.whitelist)),
        navigateFallback(config.offline.whitelist)
      ),
      navigateFallbackWhitelist: (
        console.log('navigateFallbackWhitelist', navigateFallbackWhitelist(config.offline.whitelist)),
        navigateFallbackWhitelist(config.offline.whitelist)
      ),
      runtimeCaching: (
        console.log('runtimeCaching', runtimeCaching(config.offline.runtime)),
        runtimeCaching(config.offline.runtime)
      ),
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
    })),
    when(config.externals, () => new Externals({files: config.externals}))
  ]),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules(?!\/@s-ui\/studio\/src)/,
        loader: 'babel-loader',
        query: {
          presets: ['sui']
        }
      },
      {
        test: /(\.css|\.scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

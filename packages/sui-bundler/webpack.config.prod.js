/* eslint-disable no-console */
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const uglifyJsPlugin = require('./shared/uglify')
const webpack = require('webpack')
const definePlugin = require('./shared/define')
const babelRules = require('./shared/module-rules-babel')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')

const zlib = require('zlib')
const hasBrotliSupport = Boolean(zlib.brotliCompress)

const {
  navigateFallbackWhitelist,
  navigateFallback,
  runtimeCaching,
  directoryIndex
} = require('./shared/precache')
const {when, cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared')
const Externals = require('./plugins/externals')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')
require('./shared/shims')

const PUBLIC_PATH = process.env.CDN || config.cdn || '/'

module.exports = {
  devtool:
    config.sourcemaps && config.sourcemaps.prod
      ? config.sourcemaps.prod
      : 'none',
  mode: 'production',
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    alias: config.alias,
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: config.vendor
    ? {
        app: MAIN_ENTRY_POINT,
        vendor: config.vendor
      }
    : MAIN_ENTRY_POINT,
  target: 'web',
  output: {
    path: path.resolve(process.env.PWD, 'public'),
    publicPath: PUBLIC_PATH,
    filename: config.onlyHash
      ? '[contenthash:8].js'
      : '[name].[contenthash:8].js',
    chunkFilename: config.onlyHash
      ? '[contenthash:8].js'
      : '[name].[contenthash:8].js'
  },
  optimization: {
    minimizer: [
      uglifyJsPlugin,
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {}
      })
    ],
    runtimeChunk: true,
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
    definePlugin(),
    new MiniCssExtractPlugin({
      filename: config.onlyHash
        ? '[contenthash:8].css'
        : '[name].[contenthash:8].css',
      chunkFilename: config.onlyHash
        ? '[contenthash:8].css'
        : '[id].[contenthash:8].css'
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
    new ScriptExtHtmlWebpackPlugin(
      Object.assign(
        {
          defaultAttribute: 'defer',
          inline: 'runtime',
          prefetch: {
            test: /\.js$/,
            chunks: 'all'
          }
        },
        config.scripts
      )
    ),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    when(
      config.offline,
      () =>
        new SWPrecacheWebpackPlugin({
          dontCacheBustUrlsMatching: /\.\w{8}\./,
          filename: 'service-worker.js',
          logger(message) {
            if (message.indexOf('Total precache size is') === 0) {
              // This message occurs for every build and is a bit too noisy.
              return
            }
            console.log(message)
          },
          minify: true,
          directoryIndex: (console.log(
            'directoryIndex',
            directoryIndex(config.offline.whitelist)
          ),
          directoryIndex(config.offline.whitelist)),
          navigateFallback: (console.log(
            'navigateFallback',
            PUBLIC_PATH + navigateFallback(config.offline.whitelist)
          ),
          PUBLIC_PATH + navigateFallback(config.offline.whitelist)),
          navigateFallbackWhitelist: (console.log(
            'navigateFallbackWhitelist',
            navigateFallbackWhitelist(config.offline.whitelist)
          ),
          navigateFallbackWhitelist(config.offline.whitelist)),
          runtimeCaching: (console.log(
            'runtimeCaching',
            runtimeCaching(config.offline.runtime)
          ),
          runtimeCaching(config.offline.runtime)),
          staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
        })
    ),
    when(config.externals, () => new Externals({files: config.externals})),
    new LoaderUniversalOptionsPlugin(require('./shared/loader-options')),
    when(
      config.manualCompression,
      () =>
        new CompressionPlugin({
          filename: '[path].gz',
          threshold: 0,
          minRatio: 2,
          test: /\.(js|css)$/i
        })
    ),
    when(
      config.manualCompression && hasBrotliSupport,
      () =>
        new CompressionPlugin({
          filename: '[path].br',
          algorithm: 'brotliCompress',
          threshold: 0,
          minRatio: 2,
          test: /\.(js|css)$/i,
          compressionOptions: {level: 11}
        })
    )
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
          require.resolve('postcss-loader'),
          require.resolve('sass-loader')
        ])
      },
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  },
  resolveLoader: {
    alias: {
      'externals-manifest-loader': require.resolve(
        './loaders/ExternalsManifestLoader'
      )
    }
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

/* eslint-disable no-console */
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const {GenerateSW} = require('workbox-webpack-plugin')
const JsMinimizer = require('./shared/js-minimizer')
const webpack = require('webpack')
const definePlugin = require('./shared/define')
const babelRules = require('./shared/module-rules-babel')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')

const zlib = require('zlib')
const hasBrotliSupport = Boolean(zlib.brotliCompress)

console.log('new bundler')

const {
  navigateFallbackWhitelist,
  navigateFallback,
  runtimeCaching,
  directoryIndex
} = require('./shared/precache')

const {MAIN_ENTRY_POINT, when, cleanList, envVars, config} = require('./shared')
const Externals = require('./plugins/externals')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')
require('./shared/shims')

const PUBLIC_PATH = process.env.CDN || config.cdn || '/'
const ENABLED_SOURCE_MAPS = config.sourcemaps && config.sourcemaps.prod

const createOptimizationConfig = () => ({
  minimizer: [
    JsMinimizer({sourceMap: ENABLED_SOURCE_MAPS}),
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
})

const createModuleConfig = ({isServer} = {}) => ({
  rules: cleanList([
    babelRules({isServer}),
    {
      test: /(\.css|\.scss)$/,
      use: [
        MiniCssExtractPlugin.loader,
        require.resolve('css-loader'),
        require.resolve('postcss-loader'),
        require.resolve('sass-loader')
      ]
    },
    when(config['externals-manifest'], () =>
      manifestLoaderRules(config['externals-manifest'])
    )
  ])
})

module.exports = {
  devtool: ENABLED_SOURCE_MAPS ? config.sourcemaps.prod : 'none',
  mode: 'production',
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    alias: config.alias,
    extensions: ['*', '.js', '.jsx', '.json'],
    mainFields: ['rawsrc', 'browser', 'module', 'main']
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
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].[chunkhash:8].js'
  },
  plugins: cleanList([
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin(),
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
        new GenerateSW({
          directoryIndex: directoryIndex(config.offline.whitelist),
          navigateFallback:
            PUBLIC_PATH + navigateFallback(config.offline.whitelist),
          navigateFallbackWhitelist: navigateFallbackWhitelist(
            config.offline.whitelist
          ),
          runtimeCaching: runtimeCaching(config.offline.runtime),
          globIgnores: ["**/*.map", "**/asset-manifest.json"]
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
  },
  optimization: createOptimizationConfig(),
  module: createModuleConfig()
}

/* eslint-disable no-console */
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

const {
  navigateFallbackWhitelist,
  navigateFallback,
  runtimeCaching,
  directoryIndex
} = require('./shared/precache')
const {
  when,
  cleanList,
  envVars,
  MAIN_ENTRY_POINT,
  config
} = require('./shared/index')
const Externals = require('./plugins/externals')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')
require('./shared/shims')

const PUBLIC_PATH = process.env.CDN || config.cdn || '/'

const changePlugin = (name, instance) => plugins => {
  const pos = plugins
    .map(p => p.constructor.toString())
    .findIndex(string => string.match(name))
  return [...plugins.slice(0, pos), instance, ...plugins.slice(pos + 1)]
}

const prodConfig = {
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
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].[chunkhash:8].js'
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
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css'
    }),
    new HtmlWebpackPlugin({
      env: process.env,
      inject: 'head',
      template: './index.html',
      trackJSToken: '',
      minify: {
        collapseWhitespace: false,
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
      ...config.scripts,
      module: 'es6',
      defaultAttribute: 'defer',
      prefetch: {
        test: /\.js$/,
        chunks: 'all'
      }
    }),
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
    new LoaderUniversalOptionsPlugin(require('./shared/loader-options'))
  ]),
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

module.exports = [
  {
    ...prodConfig,
    name: 'es5',
    output: {
      ...prodConfig.output,
      path: path.resolve(process.env.PWD, 'public', 'es5'),
      publicPath: `${prodConfig.output.publicPath}es5/`
    },
    plugins: changePlugin(
      'ScriptExtHtmlWebpackPlugin',
      new ScriptExtHtmlWebpackPlugin({
        ...config.scripts,
        module: 'es6',
        defaultAttribute: 'defer',
        prefetch: {
          test: /\.js$/,
          chunks: 'all'
        },
        custom: [
          {
            test: /\.js$/,
            attribute: 'nomodule',
            value: 'true'
          }
        ]
      })
    )(prodConfig.plugins),
    module: {
      rules: [
        babelRules(),
        {
          test: /(\.css|\.scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            require.resolve('css-loader'),
            require.resolve('postcss-loader'),
            require.resolve('sass-loader')
          ]
        }
      ]
    }
  },
  {
    ...prodConfig,
    name: 'es6',
    output: {
      ...prodConfig.output,
      path: path.resolve(process.env.PWD, 'public', 'es6'),
      publicPath: `${prodConfig.output.publicPath}es6/`,
      chunkFilename: '[name].[chunkhash:8].es6.js',
      filename: '[name].[chunkhash:8].es6.js'
    },
    module: {
      rules: [
        babelRules({es6: true}),
        {
          test: /(\.css|\.scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            require.resolve('css-loader'),
            require.resolve('postcss-loader'),
            require.resolve('sass-loader')
          ]
        }
      ]
    }
  }
]

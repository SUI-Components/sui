/* eslint-disable no-console */
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
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
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
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
  plugins: cleanList([
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'runtime'],
      minChunks: 'Infinity'
    }),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    new webpack.DefinePlugin({
      __DEV__: false,
      __BASE_DIR__: JSON.stringify(process.env.PWD)
    }),
    new ExtractTextPlugin('styles.[name].[contenthash:8].css'),
    new HtmlWebpackPlugin({
      env: process.env,
      inject: 'head',
      template: './index.html',
      trackJSToken: '',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
      inline: 'runtime'
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),
    when(config.externals, () => new Externals({files: config.externals})),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      noInfo: true,
      options: {
        context: '/'
      }
    }),
    new LoaderUniversalOptionsPlugin(require('./shared/loader-options'))
  ]),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules(?!\/@schibstedspain\/sui-studio\/src)/,
        loader: 'babel-loader',
        query: {
          presets: ['sui']
        }
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        loader: 'url-loader?name=[name].[ext]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]'
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+.\d+.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader?name=[name].[hash:6].[ext]'
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /(\.css|\.scss)$/,
        use: ExtractTextPlugin.extract([
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ])
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

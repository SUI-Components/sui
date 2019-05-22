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

const changePlugin = (name, instance) => plugins => {
  const pos = plugins
    .map(p => p.constructor.toString())
    .findIndex(string => string.match(name))
  return [...plugins.slice(0, pos), instance, ...plugins.slice(pos + 1)]
}

const createModuleConfig = ({isModern, isServer} = {}) => ({
  rules: cleanList([
    babelRules({isModern, isServer}),
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

const prodConfig = {
  devtool: ENABLED_SOURCE_MAPS ? config.sourcemaps.prod : 'none',
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
      defaultAttribute: 'defer'
    }),
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
      babelRules(),
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

const legacyConfig = {
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
      custom: [
        {
          test: /\.js$/,
          attribute: 'nomodule',
          value: ''
        }
      ]
    })
  )(prodConfig.plugins),
  module: createModuleConfig()
}

const modernConfig = {
  ...prodConfig,
  name: 'es6',
  resolve: {
    ...prodConfig.resolve,
    mainFields: ['rawsrc', 'browser', 'module', 'main']
  },
  output: {
    ...prodConfig.output,
    path: path.resolve(process.env.PWD, 'public', 'es6'),
    publicPath: `${prodConfig.output.publicPath}es6/`,
    chunkFilename: '[name].[chunkhash:8].es6.js',
    filename: '[name].[chunkhash:8].es6.js'
  },
  module: createModuleConfig({isModern: true})
}

module.exports = [legacyConfig, modernConfig]

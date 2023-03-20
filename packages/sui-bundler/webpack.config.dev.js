// @ts-check

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const {envVars, MAIN_ENTRY_POINT, config, cleanList, when, isTailwindEnabled} = require('./shared/index.js')
const definePlugin = require('./shared/define.js')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader.js')
const {aliasFromConfig, defaultAlias} = require('./shared/resolve-alias.js')
const {supportLegacyBrowsers, cacheDirectory} = require('./shared/config.js')

const {resolveLoader} = require('./shared/resolve-loader.js')
const createCompilerRules = require('./shared/module-rules-compiler.js')

const outputPath = path.join(process.cwd(), 'dist')

const {CI = false, PWD = ''} = process.env

process.env.NODE_ENV = 'development'

/** @typedef {import('webpack').Configuration} WebpackConfig */

const webpackConfig = {
  name: 'client-local',
  mode: 'development',
  context: path.resolve(PWD, 'src'),
  resolve: {
    alias: {
      ...defaultAlias,
      ...aliasFromConfig
    },
    fallback: {
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/'),
      stream: false,
      zlib: false,
      timers: false
    },
    modules: ['node_modules', path.resolve(process.cwd())],
    extensions: ['.js', '.tsx', '.ts', '.json']
  },
  stats: 'errors-only',
  entry: {
    app: MAIN_ENTRY_POINT
  },
  devServer: {
    static: outputPath,
    hot: true
  },
  cache: {
    type: 'filesystem',
    cacheDirectory,
    compression: 'gzip'
  },
  target: 'web',
  optimization: {
    checkWasmTypes: false,
    emitOnErrors: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: true,
    splitChunks: false
  },
  output: {
    path: outputPath,
    pathinfo: false,
    publicPath: '/'
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js'
    }),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin({__DEV__: true}),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      env: process.env
    }),
    new ReactRefreshWebpackPlugin({overlay: false})
  ],
  resolveLoader,
  module: {
    rules: cleanList([
      createCompilerRules({supportLegacyBrowsers, isDevelopment: true}),
      {
        test: /(\.css|\.scss)$/,
        use: cleanList([
          require.resolve('style-loader'),
          when(config['externals-manifest'], () => ({
            loader: 'externals-manifest-loader',
            options: {
              manifestURL: config['externals-manifest']
            }
          })),
          require.resolve('css-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  ...(isTailwindEnabled() ? [require('tailwindcss')()] : []),
                  require('autoprefixer')({
                    overrideBrowserslist: config.targets
                  })
                ]
              }
            }
          },
          require.resolve('@s-ui/sass-loader')
        ])
      },
      when(config['externals-manifest'], () => manifestLoaderRules(config['externals-manifest']))
    ])
  },
  watch: !CI,
  devtool: config.sourcemaps && config.sourcemaps.dev ? config.sourcemaps.dev : false
}

module.exports = webpackConfig

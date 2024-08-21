// @ts-check

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {WebpackManifestPlugin} = require('webpack-manifest-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin')
const {withHydrationOverlayWebpack} = require('@builder.io/react-hydration-overlay/webpack')

const {envVars, MAIN_ENTRY_POINT, config, cleanList, when} = require('./shared/index.js')
const definePlugin = require('./shared/define.js')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader.js')
const {aliasFromConfig, defaultAlias} = require('./shared/resolve-alias.js')
const {supportLegacyBrowsers, cacheDirectory} = require('./shared/config.js')

const {resolveLoader} = require('./shared/resolve-loader.js')
const createCompilerRules = require('./shared/module-rules-compiler.js')

const outputPath = path.join(process.cwd(), '.sui/public')

const {CI = false, PWD = '', CDN} = process.env

process.env.NODE_ENV = 'development'

/** @typedef {import('webpack').Configuration} WebpackConfig */

const webpackConfig = {
  name: 'client',
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
    app: [`webpack-hot-middleware/client?path=${CDN}__webpack_hmr`, MAIN_ENTRY_POINT]
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
    publicPath: CDN
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js'
    }),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin({__DEV__: true}),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      env: process.env
    }),
    new WebpackManifestPlugin({fileName: 'asset-manifest.json'}),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({overlay: false}),
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: 'anonymous'
    })
  ],
  resolveLoader,
  module: {
    rules: cleanList([
      createCompilerRules({supportLegacyBrowsers, isDevelopment: true}),
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
          require.resolve('@s-ui/sass-loader')
        ])
      },
      when(config['externals-manifest'], () => manifestLoaderRules(config['externals-manifest']))
    ])
  },
  watch: !CI,
  devtool: config.sourcemaps && config.sourcemaps.dev ? config.sourcemaps.dev : false
}

module.exports = withHydrationOverlayWebpack({
  appRootSelector: '#root',
  isMainAppEntryPoint: entryPointName => entryPointName === 'app'
})(webpackConfig)

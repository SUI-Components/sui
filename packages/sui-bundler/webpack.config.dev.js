// @ts-check

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const definePlugin = require('./shared/define')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')
const {aliasFromConfig, defaultAlias} = require('./shared/resolve-alias')
const {envVars, MAIN_ENTRY_POINT, config, cleanList, when} = require('./shared')
const {resolveLoader} = require('./shared/resolve-loader')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)
const outputPath = path.join(process.cwd(), 'dist')

process.env.NODE_ENV = 'development'

const smp = new SpeedMeasurePlugin()

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type {WebpackConfig} */
const webpackConfig = {
  mode: 'development',
  context: path.resolve(process.env.PWD, 'src'),
  resolve: {
    alias: {
      ...defaultAlias,
      ...aliasFromConfig
    },
    fallback: {
      fs: false
    },
    modules: ['node_modules', path.resolve(process.cwd())],
    extensions: ['.js', '.json']
  },
  stats: 'errors-only',
  entry: cleanList([
    require.resolve('react-dev-utils/webpackHotDevClient'),
    MAIN_ENTRY_POINT
  ]),
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
      process: 'process/browser'
    }),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin({__DEV__: true}),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      env: process.env
    })
  ],
  resolveLoader,
  module: {
    rules: cleanList([
      {
        test: /\.jsx?$/,
        exclude: EXCLUDED_FOLDERS_REGEXP,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              cacheDirectory: true,
              presets: [require.resolve('babel-preset-sui')]
            }
          }
        ]
      },
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
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  },
  watch: true,
  devtool:
    config.sourcemaps && config.sourcemaps.dev ? config.sourcemaps.dev : false
}

module.exports = config.measure ? smp.wrap(webpackConfig) : webpackConfig

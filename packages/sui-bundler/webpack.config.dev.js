// @ts-check

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const {
  envVars,
  MAIN_ENTRY_POINT,
  config,
  cleanList,
  when
} = require('./shared/index.js')
const definePlugin = require('./shared/define.js')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader.js')
const {aliasFromConfig, defaultAlias} = require('./shared/resolve-alias.js')

const {resolveLoader} = require('./shared/resolve-loader.js')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)
const outputPath = path.join(process.cwd(), 'dist')

const {CI = false} = process.env

process.env.NODE_ENV = 'development'

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
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/')
    },
    modules: ['node_modules', path.resolve(process.cwd())],
    extensions: ['.js', '.tsx', '.ts', '.json']
  },
  stats: 'errors-only',
  entry: cleanList([
    require.resolve('./utils/webpackHotDevClient.js'),
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
      process: 'process/browser.js'
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
        test: /\.(ts|js)x?$/,
        exclude: EXCLUDED_FOLDERS_REGEXP,
        use: [
          {
            loader: require.resolve('swc-loader'),
            options: {
              minify: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                  privateMethod: true,
                  functionBind: true,
                  exportDefaultFrom: true,
                  exportNamespaceFrom: true,
                  decorators: true,
                  decoratorsBeforeExport: true,
                  topLevelAwait: true,
                  importMeta: true
                },
                transform: {
                  legacyDecorator: true,
                  react: {
                    useBuiltins: true,
                    runtime: 'automatic'
                  }
                },
                target: 'es5',
                loose: true,
                externalHelpers: true
              },
              env: {
                targets: {
                  ie: '11'
                },
                dynamicImport: true,
                loose: true,
                mode: 'entry',
                coreJs: 3
              }
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
  watch: !CI,
  devtool:
    config.sourcemaps && config.sourcemaps.dev ? config.sourcemaps.dev : false
}

module.exports = webpackConfig

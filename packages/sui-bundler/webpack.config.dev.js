const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const definePlugin = require('./shared/define')
require('./shared/shims')

const {envVars, MAIN_ENTRY_POINT, config, cleanList} = require('./shared')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}svg|${path.sep}studio)(${
    path.sep
  }workbench)?${path.sep}src)`
)

let webpackConfig = {
  mode: 'development',
  context: path.resolve(process.env.PWD, 'src'),
  resolve: {
    alias: {
      // this alias is needed so react-hot-loader works with linked packages on dev mode
      'react-hot-loader': path.resolve(
        path.join(process.env.PWD, './node_modules/react-hot-loader')
      )
    },
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: cleanList([
    require.resolve('react-dev-utils/webpackHotDevClient'),
    MAIN_ENTRY_POINT
  ]),
  target: 'web',
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin({__DEV__: true}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      env: process.env
    }),
    new LoaderUniversalOptionsPlugin(require('./shared/loader-options'))
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              baseConfig: {
                extends: [require.resolve('@s-ui/lint/eslintrc.js')]
              },
              ignore: false,
              useEslintrc: false
            },
            loader: require.resolve('eslint-loader')
          }
        ],
        exclude: EXCLUDED_FOLDERS_REGEXP
      },
      {
        test: /\.jsx?$/,
        exclude: EXCLUDED_FOLDERS_REGEXP,
        use: [
          {
            loader: require.resolve('thread-loader'),
            options: {
              poolTimeout: Infinity // keep workers alive for more effective watch mode
            }
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              cacheDirectory: true,
              highlightCode: true,
              presets: [
                [
                  require.resolve('babel-preset-sui'),
                  {
                    isDevelopment: true
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /(\.css|\.scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  devtool:
    config.sourcemaps && config.sourcemaps.dev ? config.sourcemaps.dev : 'none'
}

module.exports = webpackConfig

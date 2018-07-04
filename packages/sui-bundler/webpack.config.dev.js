const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')
const definePlugin = require('./shared/define')
require('./shared/shims')

const {envVars, MAIN_ENTRY_POINT, config, cleanList} = require('./shared')

let webpackConfig = {
  mode: 'development',
  context: path.resolve(process.env.PWD, 'src'),
  resolve: {
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
        test: /\.jsx?$/,
        exclude: new RegExp(
          `node_modules(?!${path.sep}@s-ui${path.sep}studio${path.sep}src)`
        ),
        use: [
          {
            loader: require.resolve('thread-loader'),
            options: {
              poolTimeout: Infinity // keep workers alive for more effective watch mode
            }
          },
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['sui'],
              cacheDirectory: true,
              highlightCode: true
            }
          }
        ]
      },
      {
        test: /(\.css|\.scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  }
}

module.exports = webpackConfig

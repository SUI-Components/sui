const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoaderUniversalOptionsPlugin = require('./plugins/loader-options')
const path = require('path')

require('./shared/shims')

console.log('👋  from Webpack 4')
const {envVars, MAIN_ENTRY_POINT, config, whenInstalled, cleanList} = require('./shared')

let webpackConfig = {
  mode: 'development',
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: cleanList([
    whenInstalled('react', 'react-hot-loader/patch'),
    'webpack-hot-middleware/client?reload=true',
    MAIN_ENTRY_POINT
  ]),
  target: 'web',
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.EnvironmentPlugin(envVars(config.env)),
    new webpack.DefinePlugin({
      __DEV__: true,
      __BASE_DIR__: JSON.stringify(process.env.PWD)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      env: process.env
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
      noInfo: true,
      options: {
        context: '/'
      }
    }),
    new LoaderUniversalOptionsPlugin(require('./shared/loader-options'))
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules(?!\/@s-ui\/studio\/src)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['sui']
          }
        }
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        loader: 'file-loader'},
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /(\.css|\.scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
}

module.exports = webpackConfig

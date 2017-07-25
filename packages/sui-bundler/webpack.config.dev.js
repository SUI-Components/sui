const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const jsonImporter = require('node-sass-json-importer')
const autoprefixer = require('autoprefixer')
const path = require('path')

const Happypack = require('happypack')

require('./shared/shims')
const {envVars, MAIN_ENTRY_POINT, config, whenInstalled, cleanList} = require('./shared')

module.exports = {
  context: path.resolve(process.cwd(), 'src'),
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  devtool: 'eval-source-map',
  entry: cleanList([
    whenInstalled('react', 'react-hot-loader/patch'),
    'webpack-hot-middleware/client?reload=true',
    MAIN_ENTRY_POINT
  ]),
  target: 'web',
  output: {
    path: path.resolve(process.env.PWD, 'public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new Happypack({
      threads: 4,
      loaders: ['babel-loader?presets=sui']
    }),
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
        sassLoader: {
          importer: jsonImporter
        },
        context: '/',
        postcss: () => [autoprefixer]
      }
    })
  ],
  module: {
    rules: [
      // {test: /\.jsx?$/, exclude: /node_modules(?!\/@schibstedspain\/sui-studio\/src)/, loader: 'babel-loader', query: {presets: ['sui']}},
      {test: /\.jsx?$/, exclude: /node_modules(?!\/@schibstedspain\/sui-studio\/src)/, loaders: ['happypack/loader']},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
      {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
      {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
      {test: /(\.css|\.scss)$/, loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap']}
    ]
  }
}

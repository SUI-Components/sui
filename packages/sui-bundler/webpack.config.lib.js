const webpack = require('webpack')
const {cleanList, envVars, MAIN_ENTRY_POINT, config} = require('./shared')
const uglifyJsPlugin = require('./shared/uglify')
const definePlugin = require('./shared/define')
require('./shared/shims')

module.exports = {
  mode: 'production',
  resolve: {
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
    chunkFilename: '[name].[chunkhash:8].js',
    filename: 'index.js'
  },
  optimization: {
    minimizer: [uglifyJsPlugin]
  },
  plugins: cleanList([
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin(envVars(config.env)),
    definePlugin
  ]),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['sui']
        }
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

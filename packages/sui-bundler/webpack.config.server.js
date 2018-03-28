const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')

let webpackConfig = {
  context: path.resolve(process.cwd(), 'src'),
  resolve: { extensions: ['*', '.js', '.jsx', '.json'] },
  entry: './server.js',
  target: 'node',
  output: {
    path: path.resolve(process.cwd(), 'build'),
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].[chunkhash:8].js'
  },
  externals: [webpackNodeExternals()],
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
      }
    ]
  }
}

module.exports = webpackConfig

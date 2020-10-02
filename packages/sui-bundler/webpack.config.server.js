const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')
const babelRules = require('./shared/module-rules-babel')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader')
const parseAlias = require('./shared/parse-alias')

const {config, when, cleanList} = require('./shared')

const webpackConfig = {
  context: path.resolve(process.cwd(), 'src'),
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    alias: parseAlias(config.alias)
  },
  entry: './server.js',
  target: 'node',
  output: {
    path: path.resolve(process.cwd(), 'build'),
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].[chunkhash:8].js'
  },
  optimization: {
    nodeEnv: false
  },
  externals: [webpackNodeExternals()],
  plugins: [new webpack.DefinePlugin({'global.GENTLY': false})],
  resolveLoader: {
    alias: {
      'externals-manifest-loader': require.resolve(
        './loaders/ExternalsManifestLoader'
      )
    }
  },
  module: {
    rules: cleanList([
      babelRules,
      {
        // ignore css/scss require/imports files in the server
        test: /\.s?css$/,
        use: ['null-loader']
      },
      when(config['externals-manifest'], () =>
        manifestLoaderRules(config['externals-manifest'])
      )
    ])
  }
}

module.exports = webpackConfig

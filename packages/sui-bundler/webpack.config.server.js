const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')

const {config, when, cleanList} = require('./shared/index.js')
const {cacheDirectory} = require('./shared/config.js')
const createCompilerRules = require('./shared/module-rules-compiler.js')
const manifestLoaderRules = require('./shared/module-rules-manifest-loader.js')
const {aliasFromConfig} = require('./shared/resolve-alias.js')
const {resolveLoader} = require('./shared/resolve-loader.js')

const filename = '[name].[chunkhash:8].js'

/** @typedef {import('webpack').Configuration} WebpackConfig */

const isProduction = process.env.NODE_ENV === 'production'

/** @type {WebpackConfig} */
const webpackConfig = {
  name: 'server',
  context: path.resolve(process.cwd(), 'src'),
  mode: isProduction ? 'production' : 'development',
  resolve: {
    alias: {...aliasFromConfig},
    extensions: ['.js', '.json', '.ts', '.tsx'],
    modules: ['node_modules', path.resolve(process.cwd())]
  },
  entry: './server.js',
  target: 'node',
  output: {
    chunkFilename: filename,
    filename,
    path: path.resolve(process.cwd(), 'build'),
    pathinfo: false
  },
  optimization: {
    checkWasmTypes: false,
    minimize: true,
    nodeEnv: false
  },
  cache: {
    type: 'filesystem',
    cacheDirectory,
    compression: !isProduction ? 'gzip' : false
  },
  externals: [webpackNodeExternals()],
  plugins: [new webpack.DefinePlugin({'global.GENTLY': false})],
  resolveLoader,
  module: {
    rules: cleanList([
      createCompilerRules({isServer: true}),
      {
        // ignore css/scss/svg require/imports files in the server
        test: /(\.svg|\.s?css)$/,
        type: 'asset/inline',
        generator: {
          dataUrl: () => ''
        }
      },
      when(config['externals-manifest'], () => manifestLoaderRules(config['externals-manifest']))
    ])
  }
}

module.exports = webpackConfig

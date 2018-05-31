const path = require('path')
const webpack = require('webpack')
const serverConfig = require('@s-ui/bundler/webpack.config.server')

module.exports = ({outputPath}) =>
  webpack({
    ...serverConfig,
    entry: path.join(__dirname, '..', 'server'),
    output: {
      ...serverConfig.output,
      path: outputPath,
      chunkFilename: '[name].js',
      filename: 'index.js'
    },
    externals: undefined,
    resolve: {
      ...serverConfig.resolve,
      modules: [
        path.join(__dirname, '..', 'server'),
        path.join(__dirname, '..', 'node_modules'),
        path.join(process.cwd(), 'src'),
        path.join(process.cwd(), 'node_modules'),
        'node_modules'
      ]
    }
  })

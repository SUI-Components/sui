const path = require('path')
const serverConfig = require('@s-ui/bundler/webpack.config.server')

module.exports = ({outputPath}) => ({
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
    mainFields: ['main'],
    modules: [path.join(process.cwd(), 'src'), 'node_modules']
  },
  node: {
    __filename: true,
    __dirname: true
  }
})

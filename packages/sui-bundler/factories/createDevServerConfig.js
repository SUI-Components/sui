// @ts-check

const noopServiceWorkerMiddleware = require('../utils/noopServiceWorkerMiddleware.js')
const ignoredFiles = require('../utils/ignoredFiles.js')

const {HOST, HTTPS} = process.env
const protocol = HTTPS === 'true' ? 'https' : 'http'
const host = HOST || '0.0.0.0'

const getWatchOptions = ({context, watch}) => {
  if (!watch) return false
  return {ignored: ignoredFiles(context)}
}

/** @returns {import('webpack-dev-server').Configuration} */
module.exports = config => ({
  allowedHosts: 'all',
  client: {
    logging: 'none',
    overlay: false,
    progress: false
  },
  // Enable gzip compression of generated files
  compress: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  },
  static: [
    {
      directory: 'statics',
      watch: getWatchOptions(config)
    },
    {
      directory: 'public',
      watch: getWatchOptions(config)
    },
    {
      directory: 'resources',
      watch: getWatchOptions(config)
    }
  ],
  hot: true,
  host,
  historyApiFallback: {
    disableDotRule: true
  },
  setupMiddlewares(middlewares, devServer) {
    if (!devServer) throw new Error('webpack-dev-server is not defined')

    middlewares.push(noopServiceWorkerMiddleware(config.output.publicPath))

    return middlewares
  },
  server: protocol
})

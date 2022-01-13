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

module.exports = config => ({
  allowedHosts: 'all',
  client: {
    logging: 'none',
    overlay: {
      errors: true,
      warnings: false
    },
    progress: true
  },
  static: {
    directory: 'public',
    watch: getWatchOptions(config)
  },
  hot: true,
  https: protocol === 'https',
  host,
  historyApiFallback: {
    disableDotRule: true
  },
  setupMiddlewares(middlewares, devServer) {
    if (!devServer) throw new Error('webpack-dev-server is not defined')

    middlewares.push(noopServiceWorkerMiddleware(config.output.publicPath))

    return middlewares
  }
})

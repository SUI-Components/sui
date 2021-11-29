// @ts-check

const noopServiceWorkerMiddleware = require('../utils/noopServiceWorkerMiddleware.js')
const ignoredFiles = require('../utils/ignoredFiles.js')

const {HOST, HTTPS} = process.env
const protocol = HTTPS === 'true' ? 'https' : 'http'
const host = HOST || '0.0.0.0'

const getWatchOptions = ({context, watch}) => {
  return watch
    ? {
        ignored: ignoredFiles(context)
      }
    : false
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
  onAfterSetupMiddleware(devServer) {
    // This service worker file is effectively a 'no-op' that will reset any
    // previous service worker registered for the same host:port combination.
    devServer.app.use(noopServiceWorkerMiddleware(config.output.publicPath))
  }
})

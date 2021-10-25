// @ts-check

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')

const {HOST, HTTPS} = process.env
const protocol = HTTPS === 'true' ? 'https' : 'http'
const host = HOST || '0.0.0.0'

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
    watch: {
      ignored: ignoredFiles(config.context)
    }
  },
  hot: true,
  https: protocol === 'https',
  host,
  historyApiFallback: {
    disableDotRule: true
  },
  open: true,
  onBeforeSetupMiddleware(devServer) {
    // This lets us open files from the runtime error overlay.
    devServer.app.use(errorOverlayMiddleware())
  },
  onAfterSetupMiddleware(devServer) {
    // This service worker file is effectively a 'no-op' that will reset any
    // previous service worker registered for the same host:port combination.
    devServer.app.use(noopServiceWorkerMiddleware(config.output.publicPath))
  }
})

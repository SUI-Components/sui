const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'

module.exports = (config, allowedHost) => ({
  compress: true,
  clientLogLevel: 'none',
  contentBase: 'public',
  watchContentBase: true,
  hot: true,
  publicPath: config.output.publicPath,
  quiet: true,
  watchOptions: {
    ignored: ignoredFiles(config.context)
  },
  https: protocol === 'https',
  host: host,
  overlay: false,
  historyApiFallback: {
    disableDotRule: true
  },
  public: allowedHost,
  before(app) {
    app.use(errorOverlayMiddleware())
    app.use(noopServiceWorkerMiddleware())
  }
})

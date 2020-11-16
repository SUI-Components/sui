const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'

module.exports = (config, allowedHost) => ({
  // Enable gzip compression of generated files.
  compress: true,
  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'none',
  // Tell the server where to serve content from. This is only necessary if you want to serve static files from this folder as normally they come from memory
  contentBase: 'public',
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  // Enable hot reloading server.
  hot: true,
  // Use 'ws' instead of 'sockjs-node' on server since we're using native
  // websockets in `webpackHotDevClient`.
  transportMode: 'ws',
  // Prevent a WS client from getting injected as we're already including
  // `webpackHotDevClient`.
  injectClient: false,
  // Tell the server at what URL to serve devServer.contentBase static content.
  publicPath: config.output.publicPath,
  // WebpackDevServer is noisy by default so we emit custom message instead
  // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
  quiet: true,
  // Reportedly, this avoids CPU overload on some systems.
  watchOptions: {
    ignored: ignoredFiles(config.context)
  },
  https: protocol === 'https',
  host,
  overlay: false,
  historyApiFallback: {
    disableDotRule: true
  },
  public: allowedHost,
  before(app) {
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware())
  },
  after(app) {
    // This service worker file is effectively a 'no-op' that will reset any
    // previous service worker registered for the same host:port combination.
    app.use(noopServiceWorkerMiddleware(config.output.publicPath))
  }
})

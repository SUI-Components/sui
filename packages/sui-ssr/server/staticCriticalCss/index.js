/* eslint-disable no-console */
const parser = require('ua-parser-js')
const getCriticalCssMiddleware = require('@s-ui/critical-css/src/middleware.cjs')
const {criticalDir, criticalManifest} = require('../utils')

export default legacyCriticalEnabled => (req, res, next) => {
  if (legacyCriticalEnabled) return next()

  const ua = parser(req.headers['user-agent'])
  const {type} = ua.device
  const manifest = criticalManifest({req})

  return getCriticalCssMiddleware({
    deviceType: type,
    manifest,
    criticalDir: criticalDir({req})
  })(req, res, next)
}

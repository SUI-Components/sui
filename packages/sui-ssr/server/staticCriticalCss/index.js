/* eslint-disable no-console */
const parser = require('ua-parser-js')
const getCriticalCssMiddleware = require('@s-ui/critical-css/src/middleware.cjs')
const {getCriticalManifest} = require('../utils')

export default legacyCriticalEnabled => (req, res, next) => {
  if (legacyCriticalEnabled) return next()

  // calculate device type with userAgent
  const ua = parser(req.headers['user-agent'])
  const {type} = ua.device
  const manifest = getCriticalManifest({req})

  return getCriticalCssMiddleware({
    deviceType: type,
    manifest
  })(req, res, next)
}

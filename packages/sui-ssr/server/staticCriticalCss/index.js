/* eslint-disable no-console */
const parser = require('ua-parser-js')
const getCriticalCssMiddleware = require('@s-ui/critical-css/src/middleware.cjs')
const {criticalDir, criticalManifest} = require('../utils')

export default config => (req, res, next) => {
  if (!config || !config.buildTime) return next()

  const {mandatoryCSSRules} = config
  const ua = parser(req.headers['user-agent'])
  const {type} = ua.device
  const manifest = criticalManifest({req})

  return getCriticalCssMiddleware({
    deviceType: type,
    manifest,
    criticalDir: criticalDir({req}),
    mandatoryCSSRules
  })(req, res, next)
}

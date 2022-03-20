/* eslint-disable no-console */
const parser = require('ua-parser-js')
const getCriticalCssMiddleware = require('@s-ui/critical-css/src/middleware.cjs')
const {criticalDir, criticalManifest} = require('../utils/index.js')

const criticalCssMiddleware = (req, res, next) => {
  const ua = parser(req.headers['user-agent'])
  const {type} = ua.device
  const manifest = criticalManifest({req})

  return getCriticalCssMiddleware({
    deviceType: type,
    manifest,
    criticalDir: criticalDir({req})
  })(req, res, next)
}

export default criticalCssMiddleware

/* eslint-disable no-console */
const fs = require('fs-extra')
const path = require('path')
const pathToRegexp = require('path-to-regexp')

const CRITICAL_CSS_DIR = 'critical-css'

const getFilePath = file => path.join(process.cwd(), CRITICAL_CSS_DIR, file)

export default legacyCriticalEnabled => (req, res, next) => {
  if (legacyCriticalEnabled) return next()

  const manifestFilePath = getFilePath('critical.json')
  const manifestData = fs.readFileSync(manifestFilePath, 'utf8')
  const manifest = JSON.parse(manifestData)
  const criticalPath = Object.keys(manifest).find(path => {
    const regexp = pathToRegexp(path)
    return Boolean(regexp.exec(req && req.path))
  })
  const file = criticalPath && manifest[criticalPath]
  const filePath = file && getFilePath(file)

  if (fs.existsSync(filePath)) {
    req.criticalCSS = fs.readFileSync(filePath, 'utf8')
  }

  next()
}

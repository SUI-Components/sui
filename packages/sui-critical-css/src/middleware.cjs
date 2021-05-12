/* eslint-disable no-console */
const fs = require('fs/promises')
const path = require('path')
const pathToRegexp = require('path-to-regexp')

const CRITICAL_CSS_DIR = 'critical-css'

const CACHE_CRITICAL_CSS = {}

const getFilePath = file => path.join(process.cwd(), CRITICAL_CSS_DIR, file)

module.exports = ({deviceType, manifest}) => async (req, res, next) => {
  if (deviceType !== 'mobile') return next()

  const criticalPath = Object.keys(manifest).find(path => {
    const regexp = pathToRegexp(path)
    return Boolean(regexp.exec(req && req.path))
  })

  if (!criticalPath) return next()

  if (CACHE_CRITICAL_CSS[criticalPath]) {
    req.criticalCSS = CACHE_CRITICAL_CSS[criticalPath]
    return next()
  }

  const file = manifest[criticalPath]
  const filePath = file && getFilePath(file)
  const err = await fs.access(filePath, fs.F_OK)

  if (!err) {
    try {
      const criticalCSS = await fs.readFile(filePath, 'utf8')
      req.criticalCSS = criticalCSS
      CACHE_CRITICAL_CSS[criticalPath] = criticalCSS
    } catch (e) {
      console.error(e)
    }
  }

  next()
}

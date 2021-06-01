/* eslint-disable no-console */
const fs = require('fs/promises')
const path = require('path')
const pathToRegexp = require('path-to-regexp')

const CRITICAL_CSS_DIR = 'critical-css'
const CACHE_CRITICAL_CSS = {}

const getFilePath = ({file, criticalDir}) =>
  path.join(process.cwd(), criticalDir, file)

const getDisplayNameFrom = (matchResult = {}) => {
  const {renderProps = {}} = matchResult
  const {components = []} = renderProps
  const pageComponent = components[components.length - 1]
  return pageComponent?.displayName
}

const findCriticalKeyFrom = ({manifest, pathFromRequest}) =>
  Object.keys(manifest).find(path => {
    const regexp = pathToRegexp(path)
    return Boolean(regexp.exec(pathFromRequest))
  })

module.exports = ({
  deviceType,
  manifest = {},
  criticalDir = CRITICAL_CSS_DIR
}) => async (req = {}, res, next) => {
  if (deviceType !== 'mobile') return next()

  const {matchResult, path: pathFromRequest} = req
  const displayName = getDisplayNameFrom(matchResult)

  const criticalKey =
    (manifest[displayName] && displayName) ||
    findCriticalKeyFrom({manifest, pathFromRequest})

  if (!criticalKey) return next()

  if (CACHE_CRITICAL_CSS[criticalKey]) {
    req.criticalCSS = CACHE_CRITICAL_CSS[criticalKey]
    return next()
  }

  const file = manifest[criticalKey]
  const filePath = file && getFilePath({file, criticalDir})
  const err = await fs.access(filePath, fs.F_OK)

  if (!err) {
    try {
      const criticalCSS = await fs.readFile(filePath, 'utf8')
      req.criticalCSS = criticalCSS
      CACHE_CRITICAL_CSS[criticalKey] = criticalCSS
    } catch (e) {
      console.error(e)
    }
  }

  next()
}

/* eslint-disable no-console */
const fs = require('fs/promises')
const path = require('path')
const pathToRegexp = require('path-to-regexp') // peerDependency? ->

const CRITICAL_CSS_DIR = 'critical-css'

const CACHE_CRITICAL_CSS = {}

const getFilePath = file => path.join(process.cwd(), CRITICAL_CSS_DIR, file)

module.exports = ({deviceType: type = 'mobile', manifest}) => async (
  req,
  res,
  next
) => {
  console.log('-> critical-css-static-middleware')

  if (type !== 'mobile') return next()

  console.log({requestPath: req.path})

  const criticalPath = Object.keys(manifest).find(path => {
    const regexp = pathToRegexp(path)
    return Boolean(regexp.exec(req && req.path))
  })

  console.log({criticalPath})

  if (!criticalPath) return next()

  console.log({CACHE_CRITICAL_CSS})

  if (CACHE_CRITICAL_CSS[criticalPath]) {
    req.criticalCSS = CACHE_CRITICAL_CSS[criticalPath]
    return next()
  }

  const file = manifest[criticalPath]
  const filePath = file && getFilePath(file)

  console.log({filePath})

  const err = await fs.access(filePath, fs.F_OK)
  console.log({err})

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

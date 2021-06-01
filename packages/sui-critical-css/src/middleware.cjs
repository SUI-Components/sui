/* eslint-disable no-console */
const fs = require('fs/promises')
const path = require('path')
const pathToRegexp = require('path-to-regexp')

const CRITICAL_CSS_DIR = 'critical-css'
const CACHE_CRITICAL_CSS = {}

const getFilePath = ({file, criticalDir}) =>
  path.join(process.cwd(), criticalDir, file)

const mayCriticalCss = ({criticalPath, criticalCSS, mandatoryCSSRules}) => {
  const mandatoryCSSRulesForPath = mandatoryCSSRules[criticalPath]

  if (!mandatoryCSSRulesForPath) return criticalCSS

  const mandatoryRuleChecks = mandatoryCSSRulesForPath.map(mandatoryRule =>
    criticalCSS.includes(mandatoryRule)
  )

  const invalidMandatoryRules = mandatoryRuleChecks.some(
    check => check === false
  )

  return !invalidMandatoryRules && criticalCSS
}

module.exports = ({
  deviceType,
  manifest,
  criticalDir = CRITICAL_CSS_DIR,
  mandatoryCSSRules = {}
}) => async (req, res, next) => {
  if (deviceType !== 'mobile') return next()
  const pathName = req && req.path

  const criticalPath = Object.keys(manifest).find(path => {
    const regexp = pathToRegexp(path)
    return Boolean(regexp.exec(pathName))
  })

  if (!criticalPath) return next()

  if (CACHE_CRITICAL_CSS[criticalPath]) {
    req.criticalCSS = mayCriticalCss({
      criticalCSS: CACHE_CRITICAL_CSS[criticalPath],
      criticalPath,
      mandatoryCSSRules
    })
    return next()
  }

  const file = manifest[criticalPath]
  const filePath = file && getFilePath({file, criticalDir})
  const err = await fs.access(filePath, fs.F_OK)

  if (!err) {
    try {
      const criticalCSS = await fs.readFile(filePath, 'utf8')
      req.criticalCSS = mayCriticalCss({
        criticalCSS: criticalCSS,
        criticalPath,
        mandatoryCSSRules
      })
      CACHE_CRITICAL_CSS[criticalPath] = criticalCSS
    } catch (e) {
      console.error(e)
    }
  }

  next()
}

/* eslint-disable no-console */
import https from 'https'
import parser from 'ua-parser-js'
import {hrTimeToMs, buildRequestUrl} from '../utils'

let __REQUESTING__ = false
let __CACHE__ = {}
const __RETRYS_BY_HASH__ = {}
const __MAX_RETRYS_BY_HASH__ = 3
const __CRITICAL_CSS_SERVICE_DOMAIN__ =
  'https://critical-css-service.es-global-pro.schip.io'

const generateMinimalCSSHash = routes => {
  return routes.reduce((acc, route) => {
    route.path && (acc += route.path)
    return acc
  }, '')
}

const logMessageFactory = url => message =>
  process.env.VERBOSE &&
  console.log(`\u001b[36m[CRITICAL CSS](${url})\u001b[0m`, message)

export default config => (req, res, next) => {
  const startCriticalCSSTime = process.hrtime()
  const {matchResult = {}, performance = {}} = req
  const logMessage = logMessageFactory(req.url)
  const {error, renderProps} = matchResult

  if (error) {
    return next(error)
  }

  if (!renderProps) {
    return next()
  }

  if (req.skipSSR || !config || process.env.DISABLE_CRITICAL_CSS === 'true') {
    logMessage("Skip middleware because it's inactive")
    return next()
  }

  if (req.url.match('x-criticalcss-cache-invalidate')) {
    __CACHE__ = {}

    logMessage('CriticalCSS cache invalidated')
  }

  const currentConfig = {
    ...config,
    ...config[process.env.NODE_ENV],
    ...config[process.env.STAGE]
  }

  if (
    Array.isArray(currentConfig.blackListURLs) &&
    currentConfig.blackListURLs.some(regex => req.url.match(regex))
  ) {
    logMessage('Skip middleware because url is blacklisted')
    return next()
  }

  const ua = parser(req.get('User-Agent'))
  const requestUrl = buildRequestUrl(req)
  const type = ua.device.type
  const deviceTypes = {
    desktop: 'd',
    tablet: 't',
    mobile: 'm'
  }
  const device = deviceTypes[type] || deviceTypes.desktop

  if (
    Array.isArray(currentConfig.blackListRoutePaths) &&
    currentConfig.blackListRoutePaths.some(routePath =>
      renderProps.routes.some(route => route.path === routePath)
    )
  ) {
    logMessage('Skip middleware because route path is blacklisted')
    return next()
  }

  const hash = generateMinimalCSSHash(renderProps.routes) + '|' + device
  const criticalCSS = __CACHE__[hash]
  const retrysByHash = __RETRYS_BY_HASH__[hash] || 0

  if (
    !criticalCSS &&
    !__REQUESTING__ &&
    retrysByHash <= __MAX_RETRYS_BY_HASH__
  ) {
    logMessage(`Generation Critical CSS for -> ${requestUrl} with ${hash}`)

    const serviceRequestUrl = `${__CRITICAL_CSS_SERVICE_DOMAIN__}/${device}?url=${encodeURIComponent(
      requestUrl
    )}&extraHeaders=${encodeURIComponent(
      JSON.stringify(currentConfig.customHeaders || {})
    )}`

    logMessage(serviceRequestUrl)

    __REQUESTING__ = true
    https.get(serviceRequestUrl, res => {
      let css = ''
      if (res.statusCode !== 200) {
        __REQUESTING__ = false
        logMessage(`No 200 request, statusCode: ${res.statusCode}`)

        return
      }
      res.on('data', data => {
        css += data
      })

      res.on('error', () => {
        logMessage(`Error Requesting ${serviceRequestUrl}`)
        __REQUESTING__ = false
        __RETRYS_BY_HASH__[hash] = __RETRYS_BY_HASH__[hash]
          ? __RETRYS_BY_HASH__[hash] + 1
          : 0
      })

      res.on('end', () => {
        __REQUESTING__ = false

        const {mandatoryCSSRules} = currentConfig
        const hasMandatoryRules =
          mandatoryCSSRules && Object.keys(mandatoryCSSRules).length >= 1

        if (hasMandatoryRules) {
          // Check if any currentConfig mandatory CSS rule is missing in generated critical CSS
          const isMandatoryCssMissingInCritical = renderProps.routes.find(
            ({path}) => {
              if (!path) {
                return false
              }

              const mandatoryCSSRulesForPath = mandatoryCSSRules[path]
              if (!mandatoryCSSRulesForPath) return false

              const checkCssRuleAgainstPath = cssRule => {
                const hasMismatch = !css.includes(cssRule)
                if (hasMismatch) {
                  logMessage(
                    `Mismatch detected at ${path} path, mandatory CSS rule ${cssRule} missing in generated critical CSS. Cache entry not added for ${hash}`
                  )
                  return hasMismatch
                }
              }

              // Check all css rules against path
              return mandatoryCSSRulesForPath.some(checkCssRuleAgainstPath)
            }
          )

          if (isMandatoryCssMissingInCritical) {
            __RETRYS_BY_HASH__[hash] = __RETRYS_BY_HASH__[hash]
              ? __RETRYS_BY_HASH__[hash] + 1
              : 0
            return
          }
        }

        logMessage(`Add cache entry for ${hash}`)
        __CACHE__[hash] = css
      })
    })
  }

  criticalCSS && (req.criticalCSS = criticalCSS)

  const diffCriticalCSSTime = process.hrtime(startCriticalCSSTime)

  req.performance = {
    ...performance,
    criticalCSS: hrTimeToMs(diffCriticalCSSTime)
  }

  next()
}

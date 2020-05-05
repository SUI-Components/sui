/* eslint-disable no-console */
import routes from 'routes'
import match from '@s-ui/react-router/lib/match'
import https from 'https'
import parser from 'ua-parser-js'

let __REQUESTING__ = false
let __CACHE__ = {}
const __RETRYS_BY_HASH__ = {}
const __MAX_RETRYS_BY_HASH__ = 3

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
  const logMessage = logMessageFactory(req.url)

  if (req.skipSSR || !config || process.env.DISABLE_CRITICAL_CSS === 'true') {
    logMessage('Skip middleware because it is inactive')
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
  const urlRequest =
    (process.env.CRITICAL_CSS_PROTOCOL ||
      currentConfig.protocol ||
      req.protocol) +
    ':/' +
    (process.env.CRITICAL_CSS_HOST || currentConfig.host || req.hostname) +
    req.url
  const type = ua.device.type
  const deviceTypes = {
    desktop: 'd',
    tablet: 't',
    mobile: 'm'
  }
  const device = deviceTypes[type] || deviceTypes.desktop
  const {url} = req

  match(
    {routes, location: url},
    async (error, redirectLocation, renderProps) => {
      if (error) {
        return next(error)
      }

      if (!renderProps) {
        return next()
      }

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
        logMessage(`Generation Critical CSS for -> ${urlRequest} with ${hash}`)

        const serviceRequestURL = `https://critical-css-service.now.sh/${device}/${urlRequest}`
        const headers = currentConfig.customHeaders
        const options = {
          ...(headers && {
            headers
          })
        }

        logMessage(serviceRequestURL)

        __REQUESTING__ = true
        https.get(serviceRequestURL, options, res => {
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
            logMessage(`Error Requesting ${serviceRequestURL}`)
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

            // Check if any currentConfig mandatory CSS rule is missing in generated critical CSS
            const isMandatoryCssMissingInCritical = renderProps.routes.find(
              route => {
                const mandatoryCSSRulesForPath = mandatoryCSSRules[route.path]
                if (!mandatoryCSSRulesForPath) return false

                const checkCssRuleAgainstPath = cssRule => {
                  const hasMismatch = !css.includes(cssRule)
                  if (hasMismatch) {
                    logMessage(
                      `Mismatch detected at ${route.path} path, mandatory CSS rule ${cssRule} missing in generated critical CSS. Cache entry not added for ${hash}`
                    )
                    return hasMismatch
                  }
                }

                // Check all css rules against path
                return mandatoryCSSRulesForPath.some(checkCssRuleAgainstPath)
              }
            )

            if (hasMandatoryRules && isMandatoryCssMissingInCritical) {
              __RETRYS_BY_HASH__[hash] = __RETRYS_BY_HASH__[hash]
                ? __RETRYS_BY_HASH__[hash] + 1
                : 0
              return
            }

            logMessage(`Add cache entry for ${hash}`)
            __CACHE__[hash] = css
          })
        })
      }

      criticalCSS && (req.criticalCSS = criticalCSS)

      next()
    }
  )
}

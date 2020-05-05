/* eslint-disable no-console */
import routes from 'routes'
import {match} from 'react-router'
import https from 'https'
import parser from 'ua-parser-js'

let __REQUESTING__ = false
let __CACHE__ = {}

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
    currentConfig &&
    currentConfig.blackListURLs &&
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
        currentConfig &&
        currentConfig.blackListRoutePaths &&
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

      if (!criticalCSS && !__REQUESTING__) {
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
          })

          res.on('end', () => {
            logMessage(`Add cache entry for ${hash}`)
            __REQUESTING__ = false

            // eslint-disable-next-line no-debugger
            debugger

            // If Guards are ok then
            if (
              currentConfig &&
              currentConfig.mandatoryCSSRules &&
              Object.keys(currentConfig.mandatoryCSSRules).length >= 1 &&
              renderProps.routes.find(route => {
                // Find for css rule missMatch
                const mandatoryCSSRulesForPath =
                  currentConfig.mandatoryCSSRules[route.path]
                if (!mandatoryCSSRulesForPath) {
                  return false
                }
                const hasMissmatch = mandatoryCSSRulesForPath.some(
                  cssRule => css.indexOf(cssRule) === -1
                )
                return hasMissmatch
              })
            ) {
              return
            }

            __CACHE__[hash] = css
          })
        })
      }

      criticalCSS && (req.criticalCSS = criticalCSS)

      next()
    }
  )
}

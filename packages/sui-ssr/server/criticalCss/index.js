/* eslint-disable no-console */
import routes from 'routes'
import {match} from 'react-router'
import https from 'https'
import parser from 'ua-parser-js'

let __REQUESTING__ = false
const __CACHE__ = {}

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

  if (
    config &&
    config.blackListURLs &&
    Array.isArray(config.blackListURLs) &&
    config.blackListURLs.some(regex => req.url.match(regex))
  ) {
    logMessage('Skip middleware because url is blacklisted')
    return next()
  }

  const ua = parser(req.get('User-Agent'))
  const urlRequest =
    (process.env.CRITICAL_CSS_PROTOCOL || config.protocol || req.protocol) +
    ':/' +
    (process.env.CRITICAL_CSS_HOST || config.host || req.hostname) +
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

      const hash = generateMinimalCSSHash(renderProps.routes) + '|' + device
      const criticalCSS = __CACHE__[hash]

      if (!criticalCSS && !__REQUESTING__) {
        logMessage(`Generation Critical CSS for -> ${urlRequest} with ${hash}`)

        const serviceRequestURL = `https://critical-css-service.now.sh/${device}/${urlRequest}`
        const headers = config.customHeaders
        const options = {
          ...(headers && {headers})
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
            __CACHE__[hash] = css
          })
        })
      }

      criticalCSS && (req.criticalCSS = criticalCSS)

      next()
    }
  )
}

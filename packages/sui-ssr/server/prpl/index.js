import routes from 'routes'
import {match} from 'react-router'
import https from 'https'
import parser from 'ua-parser-js'

let __REQUESTING__ = false
let __CACHE__ = {}

const generatePRPLHash = routes => {
  return routes.reduce((acc, route) => {
    route.path && (acc += route.path)
    return acc
  }, '')
}

const logMessageFactory = url => message =>
  process.env.VERBOSE &&
  console.log(`\u001b[32m[PRPL](${url})\u001b[0m`, message)

export default config => (req, res, next) => {
  const logMessage = logMessageFactory(req.url)
  if (req.url.match('x-prpl-cache-invalidate')) {
    logMessage('Cache invalidate')
    __CACHE__ = {}
  }

  if (req.skipSSR || !config || process.env.DISABLE_PRPL === 'true') {
    logMessage('Skip middleware because it is inactive')
    return next()
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

  const urlRequest =
    (process.env.PRPL_PROTOCOL || currentConfig.protocol || req.protocol) +
    '://' +
    (process.env.PRPL_HOST || currentConfig.host || req.hostname) +
    req.url
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

      const hash =
        generatePRPLHash(renderProps.routes) + '|' + 'FIX_M_ALL_REQUEST'
      const prpl = __CACHE__[hash]

      if (!prpl && !__REQUESTING__) {
        logMessage(`Generation PRPL for -> ${urlRequest} with ${hash}`)

        const serviceRequestURL = `https://critical-prpl-service.now.sh/prpl?device=m&url=${encodeURIComponent(
          urlRequest
        )}&cdn=${currentConfig.cdn}&strategy=${currentConfig.strategy}`

        logMessage(serviceRequestURL)

        const headers = currentConfig.customHeaders
        const options = {
          ...(headers && {headers})
        }

        __REQUESTING__ = true
        https.get(serviceRequestURL, options, res => {
          let json = ''
          if (res.statusCode !== 200) {
            __REQUESTING__ = false
            logMessage(`No 200 request, statusCode: ${res.statusCode}`)

            return
          }
          res.on('data', data => {
            json += data
          })
          res.on('error', () => {
            logMessage(`Error Requesting ${serviceRequestURL}`)
            __REQUESTING__ = false
          })
          res.on('end', () => {
            __REQUESTING__ = false
            try {
              __CACHE__[hash] = JSON.parse(json)
              logMessage(`Add cache entry for ${hash}`)
            } catch (e) {
              logMessage('Impossible parse response JSON')
            }
          })
        })
      } else {
        req.prpl = prpl
      }

      next()
    }
  )
}

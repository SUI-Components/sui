import routes from 'routes'
import {match} from 'react-router'
import https from 'https'
import parser from 'ua-parser-js'

const PRODUCTION = 'production'
const {NODE_ENV = PRODUCTION} = process.env
let __REQUESTING__ = false
let __CACHE__ = {}

const generatePRPLHash = routes => {
  return routes.reduce((acc, route) => {
    route.path && (acc += route.path)
    return acc
  }, '')
}

const logMessage = message =>
  NODE_ENV !== PRODUCTION && console.log('[PRPL]', message)

export default config => (req, res, next) => {
  if (req.url.match('x-prpl-cache-invalidate')) {
    __CACHE__ = {}
  }

  if (req.skipSSR || !config || process.env.DISABLE_PRPL === 'true') {
    return next()
  }

  if (
    config &&
    config.blackListURLs &&
    Array.isArray(config.blackListURLs) &&
    config.blackListURLs.some(regex => req.url.match(regex))
  ) {
    return next()
  }

  const ua = parser(req.get('User-Agent'))
  const urlRequest =
    (process.env.PRPL_PROTOCOL || config.protocol || req.protocol) +
    '://' +
    (process.env.PRPL_HOST || config.host || req.hostname) +
    req.url
  const type = ua.device.type
  const deviceTypes = {
    desktop: 'd',
    tablet: 't',
    mobile: 'm'
  }
  const device = deviceTypes[type] || deviceTypes.mobile
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

      const hash = generatePRPLHash(renderProps.routes) + '|' + device
      const prpl = __CACHE__[hash]

      if (!prpl && !__REQUESTING__) {
        logMessage(`Generation PRPL for -> ${urlRequest} with ${hash}`)

        const serviceRequestURL = `https://critical-prpl-service.now.sh/prpl?device=${device}&url=${encodeURIComponent(
          urlRequest
        )}&cdn=${config.cdn}&strategy=${config.strategy}`

        const headers = config.customHeaders
        const options = {
          ...(headers && {headers})
        }

        __REQUESTING__ = true
        https.get(serviceRequestURL, options, res => {
          let json = ''
          if (res.statusCode !== 200) {
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
            logMessage(`Add cache entry for ${hash}`)
            __REQUESTING__ = false
            try {
              __CACHE__[hash] = JSON.parse(json)
              console.log({json})
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

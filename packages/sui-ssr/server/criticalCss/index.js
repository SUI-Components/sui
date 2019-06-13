import routes from 'routes'
import {match} from 'react-router'
import https from 'https'
import parser from 'ua-parser-js'

const PRODUCTION = 'production'
const {NODE_ENV = PRODUCTION} = process.env
const __CACHE__ = {}

const generateMinimalCSSHash = routes => {
  return routes.reduce((acc, route) => {
    route.path && (acc += route.path)
    return acc
  }, '')
}

export default criticalCSS => (req, res, next) => {
  if (!criticalCSS || process.env.DISABLE_CRITICAL_CSS === 'true') {
    return next()
  }

  if (
    criticalCSS &&
    criticalCSS.blackListURLs &&
    Array.isArray(criticalCSS.blackListURLs) &&
    criticalCSS.blackListURLs.some(regex => req.url.match(regex))
  ) {
    return next()
  }

  const ua = parser(req.get('User-Agent'))
  const urlRequest =
    req.protocol +
    '://' +
    (process.env.CRITICAL_CSS_HOST || req.hostname) +
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

      if (!criticalCSS) {
        NODE_ENV !== PRODUCTION &&
          console.log(
            'Generation Critical CSS for -> ',
            urlRequest,
            'with hash: ',
            hash
          )

        const serviceRequestURL = `https://critical-css-service.now.sh/${device}/${urlRequest}`
        https.get(serviceRequestURL, res => {
          let css = ''
          if (res.statusCode !== 200) {
            NODE_ENV !== PRODUCTION &&
              console.log('No 200 request, statusCode:', res.statusCode)
            return
          }
          res.on('data', data => {
            css += data
          })
          res.on('end', () => {
            NODE_ENV !== PRODUCTION &&
              console.log(`Add cache entry for ${hash}`)
            __CACHE__[hash] = css
          })
        })
      }

      criticalCSS && (req.criticalCSS = criticalCSS)

      next()
    }
  )
}

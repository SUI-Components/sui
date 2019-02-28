import routes from 'routes'
import {match} from 'react-router'
import https from 'https'
import parser from 'ua-parser-js'

const __CACHE__ = {}

const generateMinimalCSSHash = routes => {
  return routes.reduce((acc, route) => {
    route.path && (acc += route.path)
    return acc
  }, '')
}

export default withCriticalCSS => (req, res, next) => {
  if (!withCriticalCSS) {
    return next()
  }

  const ua = parser(req.headers['user-agent'])
  const urlRequest =
    req.protocol +
    '://' +
    (process.env.CRITICAL_CSS_HOST || req.get('host')) +
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
        console.log(
          'Generation Critical CSS for -> ',
          urlRequest,
          'whith hash: ',
          hash
        )

        const serviceRequestURL = `https://minimal-css-service.now.sh/${device}/${urlRequest}`
        https.get(serviceRequestURL, res => {
          let css = ''
          res.on('data', data => {
            css += data
          })
          res.on('end', () => {
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

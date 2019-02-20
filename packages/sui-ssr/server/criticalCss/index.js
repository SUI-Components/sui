import routes from 'routes'
import https from 'https'
import parser from 'ua-parser-js'

export default (req, res, next) => {
  const ua = parser(req.headers['user-agent'])
  const urlRequest =
    req.protocol + '://' + ('milanuncios.com' || req.get('host')) + req.url // TODO: Remove milanuncios!!!!
  const type = ua.device.type
  const device = type === 'mobile' ? 'm' : type === 'tablet' ? 't' : 'd'

  console.log(routes)

  https.get(
    `https://minimal-css-service.now.sh/${device}/${urlRequest}`,
    res => {
      let css = ''
      res.on('data', data => (css += data))
      res.on('end', () => {
        debugger // eslint-disable-line
        console.log(routes)
      })
    }
  )
  next()
}

const fs = require('fs')
const path = require('path')
const http = require('http')

const hostname = '127.0.0.1'
const port = 1234

const [, , BASE_PATH] = process.argv

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    return res.end(Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64'), 'binary') // eslint-disable-line
  }

  const ext = path.extname(req.url)

  const resource = fs.readFileSync(path.join(BASE_PATH, ext === '' ? 'index.html' : req.url), {encoding: 'utf8'})

  res.statusCode = 200
  res.setHeader(
    'Content-Type',
    ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : '' // eslint-disable-line
  )
  res.end(resource)
})

server.listen(port, hostname, () => {
  console.log(`Stactically serving content from ${BASE_PATH} in http://${hostname}:${port}`)
})

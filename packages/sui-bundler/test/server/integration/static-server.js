const http = require('http')

const hostname = '127.0.0.1'
const port = 1234

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify({
      '/image.jpeg': '/image.123abc.jpeg',
      '/css-image.jpeg': '/css-image.456def.jpeg'
    })
  )
})

server.listen(port, hostname, () => {
  console.log(`Static manifest serve from http://${hostname}:${port}/manifest.json`)
})

/* eslint no-nested-ternary:0 */
const Gunzip = require('zlib').Gunzip

const CONTENT_TYPE_HTML = /text\/html/
const GZIP_ENCODING = /gzip/i

/**
 * Where the magic happen!
 * */
const replace = (buff) => {
  const tag = 'body'
  const snippet = `
    <script async src="/bundle.js"></script>
    </${tag}>
  `
  return buff.toString('utf8').replace(`</${tag}>`, `${snippet}`)
}

module.exports = (req, res, next) => {
  const gunzip = Gunzip()
  const _write = res.write
  const _end = res.end
  const _writeHead = res.writeHead

  res.writeHead = (code, headers) => {
    res.isGziped = !!(res.getHeader('content-encoding') || '').match(GZIP_ENCODING)
    res.isHtml = !!(res.getHeader('content-type') || '').match(CONTENT_TYPE_HTML)

    res.removeHeader('Content-Length')
    headers && delete headers['content-length']

    res.removeHeader('Content-Encoding')
    headers && delete headers['content-encoding']

    _writeHead.call(res, code, headers)
  }

  res.write = (buff) => {
    !res.isHtml ? _write.call(res, buff)
      : res.isGziped ? gunzip.write(buff)
        : _write.call(res, replace(buff))
  }

  res.end = (buff) => {
    res.isGziped ? gunzip.end(buff) : _end.call(res, buff)
  }

  gunzip.on('data', buff => _write.call(res, replace(buff)))

  gunzip.on('end', buff => _end.call(res, buff))

  gunzip.on('error', () => {})

  next()
}

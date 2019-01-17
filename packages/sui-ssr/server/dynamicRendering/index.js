import path from 'path'
import fs from 'fs'
import seoBotDetect from './seoBotDetect'

const INDEX_HTML_PATH = path.join(process.cwd(), 'public', 'index.html')

export default function dynamicRendering(fallback, dynamicsURLS = []) {
  return function middleware(req, resp, next) {
    if (!dynamicsURLS.length) {
      return fallback.call(this, req, resp, next)
    }

    return seoBotDetect(req) ? fallback.call(this, req, resp, next) : // eslint-disable-line
           dynamicsURLS.some(url => req.url.match(new RegExp(url))) ? fs.createReadStream(INDEX_HTML_PATH).pipe(resp) : // eslint-disable-line
           fallback.call(this, req, resp, next) // eslint-disable-line
  }
}

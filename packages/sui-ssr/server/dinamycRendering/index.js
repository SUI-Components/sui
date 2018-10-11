import path from 'path'
import fs from 'fs'
import seoBotDetect from './seoBotDetect'

const {DINAMYC_RENDERING = false} = process.env
const INDEX_HTML_PATH = path.join(process.cwd(), 'public', 'index.html')

export default function dinamycRendering(fallback) {
  return function middleware(req, resp, next) {
    if (!DINAMYC_RENDERING) {
      return fallback.call(this, req, resp, next)
    }

    return seoBotDetect(req)
      ? fallback.call(this, req, resp, next)
      : fs.createReadStream(INDEX_HTML_PATH).pipe(resp)
  }
}

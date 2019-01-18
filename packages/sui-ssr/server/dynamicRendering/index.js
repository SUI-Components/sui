import path from 'path'
import fs from 'fs'
import seoBotDetect from './seoBotDetect'

const INDEX_HTML_PATH = path.join(process.cwd(), 'public', 'index.html')

export default function dynamicRendering(fallback, dynamicsURLS = []) {
  return function middleware(req, resp, next) {
    if (!dynamicsURLS.length || seoBotDetect(req)) {
      return fallback.call(this, req, resp, next)
    }

    const enabledDynamicRendering = dynamicsURLS.some(url =>
      req.url.match(new RegExp(url))
    )

    enabledDynamicRendering && resp.type('html')

    return enabledDynamicRendering
      ? fs.createReadStream(INDEX_HTML_PATH).pipe(resp)
      : fallback.call(this, req, resp, next)
  }
}

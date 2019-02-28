import path from 'path'
import fs from 'fs'
import seoBotDetect from './seoBotDetect'
import replace from 'stream-replace'

const INDEX_HTML_PATH = path.join(process.cwd(), 'public', 'index.html')
const HEAD_OPENING_TAG = '<head>'

export default function dynamicRendering(fallback, dynamicsURLS = []) {
  return function middleware(req, resp, next) {
    const criticalCSS = req.criticalCSS

    if (!dynamicsURLS.length || seoBotDetect(req)) {
      return fallback.call(this, req, resp, next)
    }

    const enabledDynamicRendering = dynamicsURLS.some(url =>
      req.url.match(new RegExp(url))
    )

    enabledDynamicRendering && resp.type('html')

    let indexHTMLStream
    if (criticalCSS) {
      indexHTMLStream = fs
        .createReadStream(INDEX_HTML_PATH)
        .pipe(
          replace(
            HEAD_OPENING_TAG,
            `${HEAD_OPENING_TAG}<style>${criticalCSS}</style>`
          )
        )
        .pipe(
          replace(
            'rel="stylesheet"',
            'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\'"'
          )
        )
    } else {
      indexHTMLStream = fs.createReadStream(INDEX_HTML_PATH)
    }

    return enabledDynamicRendering
      ? indexHTMLStream.pipe(resp)
      : fallback.call(this, req, resp, next)
  }
}

import path from 'path'
import fs from 'fs'
import seoBotDetect from './seoBotDetect'
import replace from 'stream-replace'
import replaceWithLoadCSSPolyfill from '../template/cssrelpreload'
import {publicFolderByHost} from '../utils'

const HEAD_OPENING_TAG = '<head>'
const HEAD_CLOSING_TAG = '</head>'

const indexHtmlPath = reqHeaders =>
  path.join(process.cwd(), publicFolderByHost(reqHeaders), 'index.html')

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
        .createReadStream(indexHtmlPath(req.headers))
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
        .pipe(
          replace(
            HEAD_CLOSING_TAG,
            replaceWithLoadCSSPolyfill(HEAD_CLOSING_TAG)
          )
        )
    } else {
      indexHTMLStream = fs.createReadStream(indexHtmlPath(req.headers))
    }

    return enabledDynamicRendering
      ? indexHTMLStream.pipe(resp)
      : fallback.call(this, req, resp, next)
  }
}

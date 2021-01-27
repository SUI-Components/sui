import seoBotDetect from './seoBotDetect'
import replaceWithLoadCSSPolyfill from '../template/cssrelpreload'

const HEAD_OPENING_TAG = '<head>'
const HEAD_CLOSING_TAG = '</head>'

export default function dynamicRendering(fallback, dynamicsURLS = []) {
  return function middleware(req, resp, next) {
    const {criticalCSS} = req

    if (!dynamicsURLS.length || seoBotDetect(req)) {
      return fallback.call(this, req, resp, next)
    }

    const enabledDynamicRendering = dynamicsURLS.some(url =>
      req.url.match(new RegExp(url))
    )

    enabledDynamicRendering && resp.type('html')

    let htmlTemplateResponse = req.htmlTemplate

    if (criticalCSS) {
      htmlTemplateResponse = htmlTemplateResponse
        .replace(
          HEAD_OPENING_TAG,
          `${HEAD_OPENING_TAG}<style>${criticalCSS}</style>`
        )
        .replace(
          'rel="stylesheet"',
          'rel="stylesheet" media="only x" as="style" onload="this.media=\'all\'"'
        )
        .replace(HEAD_CLOSING_TAG, replaceWithLoadCSSPolyfill(HEAD_CLOSING_TAG))
    }

    return enabledDynamicRendering
      ? resp.send(htmlTemplateResponse)
      : fallback.call(this, req, resp, next)
  }
}

const APP_PLACEHOLDER = '<!-- APP -->'
const HEAD_CLOSING_TAG = '</head>'
const BODY_CLOSING_TAG = '</body>'

/**
 * Loads public/index.html once and returns an array with two items,
 * one for the head and one for the body. Html opening and closing tag will be present respectively on each part.
 * @return {Array}
 */
export const getTplParts = req => {
  const appParts = req.htmlTemplate.split(HEAD_CLOSING_TAG)

  appParts[0] = `${appParts[0]}${HEAD_CLOSING_TAG}`

  return appParts
}

export class HtmlBuilder {}

HtmlBuilder.buildHead = ({headTplPart, headString = ''}) => {
  const headElement = headTplPart.substr(headTplPart.indexOf('<head'))
  const headOpenningTag = headElement.substr(0, headElement.indexOf('>') + 1)

  return headTplPart.replace(headOpenningTag, `${headOpenningTag}${headString}`)
}

HtmlBuilder.buildBody = ({
  bodyAttributes,
  bodyTplPart,
  reactString,
  appConfig,
  initialProps,
  performance
}) => {
  let html = `${bodyTplPart}`

  if (bodyAttributes) {
    html = html.replace('<body>', `<body ${bodyAttributes.toString()}>`)
  }
  if (reactString) {
    html = html.replace(APP_PLACEHOLDER, reactString)
  }

  if (performance) {
    const {getInitialProps: server, renderToString: render} = performance

    html = html.replace(
      BODY_CLOSING_TAG,
      `${HtmlBuilder.injectDataHydration({
        windowPropertyName: '__PERFORMANCE_METRICS__',
        data: {server, render}
      })}${BODY_CLOSING_TAG}`
    )
  }

  html = html.replace(
    BODY_CLOSING_TAG,
    `${HtmlBuilder.injectDataHydration({
      windowPropertyName: '__APP_CONFIG__',
      data: appConfig
    })}${HtmlBuilder.injectDataHydration({
      windowPropertyName: '__INITIAL_PROPS__',
      data: initialProps
    })}${BODY_CLOSING_TAG}`
  )

  return html
}

// https://github.com/gfx/webpack/blob/1cc9f8799bd60daa0b01518294de8974a0fed495/lib/JsonGenerator.js
const stringifySafe = data => {
  const stringified = JSON.stringify(data)
  if (!stringified) {
    return undefined // Invalid JSON
  }

  return stringified.replace(/\u2028|\u2029/g, str =>
    str === '\u2029' ? '\\u2029' : '\\u2028'
  ) // invalid in JavaScript but valid JSON
}

HtmlBuilder.injectDataHydration = ({windowPropertyName, data = {}}) => {
  const jsonSource = JSON.stringify(stringifySafe(data))
  const jsonExpr = `JSON.parse(${jsonSource})`
  return `<script>window.${windowPropertyName} = ${jsonExpr};</script>`
}

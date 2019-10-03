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

HtmlBuilder.buildHead = ({headTplPart, helmetHead = {}}) => {
  return headTplPart.replace(
    HEAD_CLOSING_TAG,
    `${Object.keys(helmetHead)
      .map(section => helmetHead[section].toString())
      .join('')}${HEAD_CLOSING_TAG}`
  )
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

HtmlBuilder.injectDataHydration = ({windowPropertyName, data = {}}) =>
  `<script>window.${windowPropertyName} = ${JSON.stringify(data).replace(
    /<\//g,
    '<\\/'
  )};</script>`

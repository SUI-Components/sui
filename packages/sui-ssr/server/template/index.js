import jsesc from 'jsesc'

import {INITIAL_CONTEXT_VALUE} from '../initialContextValue/index.js'

const APP_PLACEHOLDER = '<!-- APP -->'
const HEAD_CLOSING_TAG = '</head>'
const BODY_CLOSING_TAG = '</body>'

/**
 * Loads public/index.html once and returns an array with two items,
 * one for the head and one for the body. Html opening and closing tag will be present respectively on each part.
 * @return {Array}
 */
export const getTplParts = req => {
  let copyHTMLTemplate = (' ' + req.htmlTemplate).slice(1)
  const appParts = copyHTMLTemplate.split(HEAD_CLOSING_TAG)

  appParts[0] = `${appParts[0]}${HEAD_CLOSING_TAG}`
  copyHTMLTemplate = null

  return appParts
}

export class HtmlBuilder {}

HtmlBuilder.buildHead = ({headTplPart, headString = ''}) => {
  let copyHeadTplPart = (' ' + headTplPart).slice(1)
  let copyHeadString = (' ' + headString).slice(1)

  let headElement = copyHeadTplPart.substr(copyHeadTplPart.indexOf('<head'))
  let headOpenningTag = headElement.substr(0, headElement.indexOf('>') + 1)

  const nextHead = copyHeadTplPart.replace(headOpenningTag, `${headOpenningTag}${copyHeadString}`)
  copyHeadTplPart = null
  copyHeadString = null
  headElement = null
  headOpenningTag = null

  return nextHead
}

HtmlBuilder.buildBody = ({
  bodyAttributes,
  bodyTplPart,
  reactString,
  appConfig,
  initialProps,
  performance,
  initialContextValue
}) => {
  let html = (' ' + bodyTplPart).slice(1)

  if (bodyAttributes) {
    html = html.replace('<body>', () => `<body ${bodyAttributes.toString()}>`)
  }
  if (reactString) {
    html = html.replace(APP_PLACEHOLDER, () => reactString)
  }

  if (performance) {
    const {getInitialProps: server, renderToString: render} = performance

    html = html.replace(
      BODY_CLOSING_TAG,
      () =>
        `${HtmlBuilder.injectDataHydration({
          windowPropertyName: '__PERFORMANCE_METRICS__',
          data: {server, render}
        })}${BODY_CLOSING_TAG}`
    )
  }

  const hydrationDataConfigs = [
    {
      windowPropertyName: '__APP_CONFIG__',
      data: appConfig
    },
    {
      windowPropertyName: '__INITIAL_PROPS__',
      data: initialProps
    },
    {
      windowPropertyName: INITIAL_CONTEXT_VALUE,
      data: initialContextValue
    }
  ]

  /**
   * Given the injectDataHidration fn that returns a string, this reducer
   * concatenates each output of the fn for every hydrationDataConfig
   */
  const hydrationHtml = hydrationDataConfigs.reduce(
    (acc, config) => `${acc}${HtmlBuilder.injectDataHydration(config)}`,
    ''
  )

  html = html.replace(BODY_CLOSING_TAG, () => `${hydrationHtml}${BODY_CLOSING_TAG}`)

  return html
}

HtmlBuilder.injectDataHydration = ({windowPropertyName, data = {}}) => {
  const jsonSource = jsesc(JSON.stringify(data), {
    json: true,
    isScriptContext: true
  })

  const jsonExpr = `JSON.parse(${jsonSource})`
  return `<script>window.${windowPropertyName} = ${jsonExpr};</script>`
}

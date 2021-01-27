/* eslint no-undef:0 */
import ReactDOM from 'react-dom'

import './styles.scss'
import Root from './components/Root'
import Raw from './components/Raw'
import {isFunction} from '../../src/components/demo/utilities'
import {importGlobals} from '../../src/components/globals'

const queryStringToJSON = queryString => {
  if (queryString.indexOf('?') > -1) {
    queryString = queryString.split('?')[1]
  }
  const pairs = queryString.split('&')
  const result = {}
  pairs.forEach(function(pair) {
    pair = pair.split('=')
    result[pair[0]] = decodeURIComponent(pair[1] || '')
  })
  return result
}

const params = queryStringToJSON(window.location.href)

const importAll = requireContext => requireContext.keys().map(requireContext)

;(async () => {
  const {default: defaultStyle} = await import(
    '!css-loader!sass-loader!component/index.scss'
  )

  let styles = []
  let requireContextThemesKeys = []
  try {
    const requireContextThemes = require.context(
      '!css-loader!sass-loader!demo/themes',
      false,
      /\.scss$/
    )
    requireContextThemesKeys = requireContextThemes.keys()
    styles = importAll(requireContextThemes)
  } catch {}

  let ctxt = {}
  try {
    ctxt = require('demo/context').default
  } catch {}

  let DemoComponent
  try {
    DemoComponent = require('demo/demo').default
  } catch {}

  let demoStyles = ''
  try {
    demoStyles = require('!css-loader!sass-loader!demo/demo/index.scss') // eslint-disable-line
  } catch {}

  const contexts = isFunction(ctxt) ? await ctxt() : ctxt
  const themes = requireContextThemesKeys.reduce((acc, path, index) => {
    const style = styles[index]
    const themeName = path.replace('./', '').replace('.scss', '')
    acc[themeName] = style.default || style
    return acc
  }, {})

  const {raw} = params
  const ComponentToRender = raw ? Raw : Root

  await importGlobals()

  ReactDOM.render(
    <ComponentToRender
      componentID={__COMPONENT_ID__}
      contexts={contexts}
      demo={DemoComponent}
      demoStyles={demoStyles}
      themes={{...themes, default: defaultStyle}}
      {...params}
    />,
    document.getElementById('app')
  )
})()

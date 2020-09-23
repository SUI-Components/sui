/* eslint no-undef:0 */
import React from 'react'
import ReactDOM from 'react-dom'

import './styles.scss'
import Root from './components/Root'
import Raw from './components/Raw'
import {isFunction} from '../../src/components/demo/utilities'

const queryStringToJSON = queryString => {
  if (queryString.indexOf('?') > -1) {
    queryString = queryString.split('?')[1]
  }
  var pairs = queryString.split('&')
  var result = {}
  pairs.forEach(function(pair) {
    pair = pair.split('=')
    result[pair[0]] = decodeURIComponent(pair[1] || '')
  })
  return result
}

const params = queryStringToJSON(window.location.href)

const importAll = requireContext => requireContext.keys().map(requireContext)

;(async () => {
  const defaultStyle = await import(
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
  } catch (e) {}

  let ctxt = {}
  try {
    const resp = require('demo/context')
    ctxt = resp.default || resp
  } catch (e) {}

  let DemoComponent
  try {
    const comp = require('demo/demo')
    DemoComponent = comp.default || comp
  } catch (e) {}

  let demoStyles = ''
  try {
    demoStyles = require('!css-loader!sass-loader!demo/demo/index.scss') // eslint-disable-line
  } catch (e) {}

  const contexts = isFunction(ctxt) ? await ctxt() : ctxt
  const themes = requireContextThemesKeys.reduce((acc, path, index) => {
    acc[path.replace('./', '').replace('.scss', '')] = styles[index]
    return acc
  }, {})

  const {raw} = params
  const ComponentToRender = raw ? Raw : Root

  ReactDOM.render(
    <ComponentToRender
      contexts={contexts}
      themes={{...themes, default: defaultStyle.default}}
      componentID={__COMPONENT_ID__}
      demo={DemoComponent}
      demoStyles={demoStyles}
      {...params}
    />,
    document.getElementById('app')
  )
})()

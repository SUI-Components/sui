/* eslint no-undef:0 */
import React from 'react'
import ReactDOM from 'react-dom'

import './styles/index.scss'
import Root from './components/Root'
import {isFunction} from '../../src/components/demo/utilities'

const importAll = requireContext => requireContext.keys().map(requireContext)
;(async () => {
  const defaultStyle = await import('!css-content-loader!css-loader!sass-loader!component/index.scss')
  let styles = []
  let requireContextThemesKeys = []
  try {
    const requireContextThemes = require.context(
      '!css-content-loader!css-loader!sass-loader!demo/themes',
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

  const contexts = isFunction(ctxt) ? await ctxt() : ctxt
  const themes = requireContextThemesKeys.reduce((acc, path, index) => {
    acc[path.replace('./', '').replace('.scss', '')] = styles[index]
    return acc
  }, {})

  ReactDOM.render(
    <Root
      contexts={contexts}
      themes={{...themes, default: defaultStyle.default}}
      componentID={__COMPONENT_ID__}
    />,
    document.getElementById('app')
  )
})()

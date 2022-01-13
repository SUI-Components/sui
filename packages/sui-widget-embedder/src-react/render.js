/* eslint-disable */

import React from 'react'
import ReactDOM from 'react-dom'

export default function render(...widgets) {
  widgets.forEach(renderSingleWidget)
}

/*******************************/

function renderSingleWidget(widget) {
  const [root, {selector, renderMultiple = false}] = widget

  // Assert a selector is provided for the widget
  if (!selector) {
    return console.warn(`[Widget] You must define a selector to use the Widget`)
  }

  // Assert at least a node exists for the provided selector
  const nodes = document.querySelectorAll(selector)
  if (!nodes.length) {
    return console.warn(`[Widget] unable find nodes using selector ${selector}`)
  }

  /**
   * Depending on renderMultiple, get the full array or only the first one
   */
  const nodesToRender = renderMultiple ? Array.from(nodes) : [nodes[0]]

  nodesToRender.forEach(node => ReactDOM.render(root, node))
}

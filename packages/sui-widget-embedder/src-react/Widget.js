/* eslint-disable no-console */

import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Context from '@s-ui/react-context'
import {Provider as ProviderLegacy} from '@s-ui/react-domain-connector'
import {useMount} from '@s-ui/react-hooks'

function renderWidgetOnDOM({children, context, node}) {
  ReactDOM.render(
    <Context.Provider value={context}>
      <ProviderLegacy {...context}>{children}</ProviderLegacy>
    </Context.Provider>,
    node
  )
}

export default function Widget({
  browser,
  children,
  domain,
  i18n,
  isVisible = true,
  node, // deprecated
  selector,
  renderMultiple = false
}) {
  useMount(function() {
    const selectorToUse = selector || node
    if (!selectorToUse) {
      return console.warn(
        `[Widget] You must define a selector or node (deprecated) to use the Widget`
      )
    }

    const nodes = document.querySelectorAll(selectorToUse)
    if (!nodes.length) {
      return console.warn(
        `[Widget] unable find nodes using selector ${selectorToUse}`
      )
    }
    // depending on renderMultiple, get the full array or only the first one
    const nodesToRender = renderMultiple ? [].slice.call(nodes) : [nodes[0]]
    // create the context object
    const context = {browser, domain, i18n}

    isVisible &&
      nodesToRender.map(node => renderWidgetOnDOM({children, context, node}))
  })

  return null
}

Widget.propTypes = {
  browser: PropTypes.object,
  children: PropTypes.element.isRequired,
  domain: PropTypes.object,
  i18n: PropTypes.object,
  isVisible: PropTypes.bool,
  node: () =>
    new Error(
      'Prop `node` is deprecated and it will be removed in the next major version. Use `selector` instead for passing the CSS Path.'
    ),
  selector: PropTypes.string.isRequired
}

/* eslint-disable no-console */

import ReactDOM from 'react-dom'

import PropTypes from 'prop-types'

import Context from '@s-ui/react-context'
import {useMount} from '@s-ui/react-hooks'

function renderWidgetOnDOM({children, context, node}) {
  ReactDOM.render(
    <Context.Provider value={context}>{children}</Context.Provider>,
    node
  )
}

export default function Widget({
  children,
  context = {},
  isVisible = true,
  selector,
  renderMultiple = false
}) {
  useMount(function () {
    if (!selector) {
      return console.warn(
        `[Widget] You must define a selector to use the Widget`
      )
    }

    const nodes = document.querySelectorAll(selector)
    if (!nodes.length) {
      return console.warn(
        `[Widget] unable find nodes using selector ${selector}`
      )
    }

    // depending on renderMultiple, get the full array or only the first one
    const nodesToRender = renderMultiple ? [].slice.call(nodes) : [nodes[0]]

    isVisible &&
      nodesToRender.map(node => renderWidgetOnDOM({children, context, node}))
  })

  return null
}

Widget.propTypes = {
  children: PropTypes.element.isRequired,
  context: PropTypes.object,
  isVisible: PropTypes.bool,
  selector: PropTypes.string.isRequired,
  renderMultiple: PropTypes.bool
}

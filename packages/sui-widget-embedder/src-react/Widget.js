import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import {Provider} from '@s-ui/react-domain-connector'

export default class Widget extends Component {
  static propTypes = {
    children: PropTypes.element,
    node: PropTypes.string,
    i18n: PropTypes.object,
    domain: PropTypes.object
  }

  componentDidMount() {
    const {node: selector, children, i18n, domain} = this.props
    const node = document.querySelector(selector)

    if (!node) {
      return console.warn(`[Widget] unable find the selector ${selector}`) // eslint-disable-line
    }

    ReactDOM.render(
      <Provider i18n={i18n} domain={domain}>
        {children}
      </Provider>,
      node
    )
  }

  render() {
    return null
  }
}

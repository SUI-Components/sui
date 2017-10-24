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

  componentDidMount () {
    const node = document.querySelector(this.props.node)
    const {children, i18n, domain} = this.props
    ReactDOM.render(
      <Provider i18n={i18n} domain={domain}>
        {children}
      </Provider>,
      node
    )
  }

  render () { return null }
}

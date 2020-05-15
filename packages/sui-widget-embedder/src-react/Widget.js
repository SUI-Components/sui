import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Context from '@s-ui/react-context'
import {Provider as ProviderLegacy} from '@s-ui/react-domain-connector'

export default class Widget extends Component {
  static propTypes = {
    children: PropTypes.element,
    node: PropTypes.string,
    i18n: PropTypes.object,
    domain: PropTypes.object,
    isVisible: PropTypes.bool,
    browser: PropTypes.object
  }

  static defaultProps = {
    isVisible: true
  }

  componentDidMount() {
    const {
      node: selector,
      children,
      i18n,
      domain,
      isVisible,
      browser
    } = this.props
    const node = document.querySelector(selector)

    if (!node) {
      return console.warn(`[Widget] unable find the selector ${selector}`) // eslint-disable-line
    }

    isVisible &&
      ReactDOM.render(
        <Context.Provider
          value={{
            i18n,
            domain,
            browser
          }}
        >
          <ProviderLegacy i18n={i18n} domain={domain} browser={browser}>
            {children}
          </ProviderLegacy>
        </Context.Provider>,
        node
      )
  }

  render() {
    return null
  }
}

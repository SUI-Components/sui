/* eslint no-console: 0 */
import React, { Component, PropTypes, Children } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import createStore from './store'

export default class Provider extends Component {
  constructor (...args) {
    super(...args)

    const { i18n, domain, store } = this.props

    this.i18n = i18n
    this.domain = domain
    this.store = store || createStore()
  }

  getChildContext () {
    return {
      i18n: this.i18n,
      domain: this.domain,
      store: this.store
    }
  }

  componentWillReceiveProps (nextProps) {
    const { i18n, domain, store } = this
    const { i18n: nextI18n, domain: nextDomain, store: nextStore } = nextProps

    if (i18n !== nextI18n) {
      console.warn('<Provider> does not support changing `i18n` on the fly.')
    }

    if (domain !== nextDomain) {
      console.warn('<Provider> does not support changing `domain` on the fly.')
    }

    if (store !== nextStore) {
      console.warn('<Provider> does not support changing `store` on the fly.')
    }
  }

  render () {
    return (
      <ReduxProvider store={this.store}>
        {Children.only(this.props.children)}
      </ReduxProvider>
    )
  }
}

Provider.displayName = 'Provider'

Provider.propTypes = {
  i18n: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  domain: PropTypes.object,
  store: PropTypes.object
}

Provider.defaultProps = {
  i18n: {
    t: literal => literal,
    n: number => number,
    c: number => number
  },
  domain: {
    get: () => Promise.rejected('Provider default domain not implemented.'),
    fake: true
  }
}

Provider.childContextTypes = {
  i18n: PropTypes.object,
  domain: PropTypes.object,
  store: PropTypes.object
}

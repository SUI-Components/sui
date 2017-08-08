import React, {Component, PropTypes} from 'react'

export default context => Target => class extends Component {
  static displayName = `withContext(${Target.displayName})`
  static childContextTypes = Object.keys(context).reduce((acc, key) => {
    acc[key] = PropTypes.object
    return acc
  }, {})

  getChildContext () {
    return context
  }

  render () {
    return <Target {...this.props} />
  }
}

import React, {Component} from 'react'
import PropTypes from 'prop-types'

const withContext = (flag, context) => Target => {
  if (!flag) {
    return Target
  }

  const types = Object.keys(context).reduce((ctxtTypes, key) => {
    ctxtTypes[key] = PropTypes.object
    return ctxtTypes
  }, {})

  class Contextify extends Component {
    static displayName = `Contextify(${Target.displayName})`
    static originalContextTypes =
      Target.originalContextTypes || Target.contextTypes || types
    static get childContextTypes() {
      return Target.originalContextTypes || Target.contextTypes || types
    }

    getChildContext() {
      return context
    }

    render() {
      return <Target {...this.props} />
    }
  }

  return Contextify
}

export default withContext

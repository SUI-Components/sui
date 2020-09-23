import React, {Component} from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'

export default /* withContext */ (flag, context) => Target => {
  if (!flag) return Target

  const types = Object.keys(context).reduce((ctxtTypes, key) => {
    ctxtTypes[key] = PropTypes.object
    return ctxtTypes
  }, {})

  const originalContextTypes =
    Target.originalContextTypes || Target.contextTypes || types

  class Contextify extends Component {
    static displayName = `Contextify(${Target.displayName})`

    static originalContextTypes = originalContextTypes

    static get childContextTypes() {
      return originalContextTypes
    }

    getChildContext() {
      return context
    }

    render() {
      return <Target {...this.props} />
    }
  }

  return hoistNonReactStatics(Contextify, Target)
}

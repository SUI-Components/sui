import {Component} from 'react'
import PropTypes from 'prop-types'

export default context => Target =>
  class extends Component {
    static displayName = `withContext(${Target.displayName})`
    static childContextTypes = Object.keys(context).reduce((acc, key) => {
      acc[key] = PropTypes.any
      return acc
    }, {})

    getChildContext() {
      return context
    }

    render() {
      return <Target {...this.props} />
    }
  }

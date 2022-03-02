import {Component} from 'react'
import PropTypes from 'prop-types'
import SUIContext from '@s-ui/react-context'

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
      return (
        <SUIContext.Provider value={context}>
          <Target {...this.props} />
        </SUIContext.Provider>
      )
    }
  }

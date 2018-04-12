import React, {Component} from 'react'
import PropTypes from 'prop-types'

const toTitle = str => {
  const [first, ...rest] = str
  return [first.toUpperCase(), ...rest].join('')
}

const mapUIServiceToProps = (...paths) => Target =>
  class Enhance extends Component {
    static displayName = `mapUIServiceToProps(${Target.displayName})`
    static originalContextTypes = Target.originalContextTypes ||
      Target.contextTypes
    static contextTypes = {
      store: PropTypes.object.isRequired
    }

    constructor (props, context) {
      super(props, context)

      this.services = paths.reduce((props, path) => {
        props[`set${toTitle(path)}UI`] = nextValue =>
          context.store.dispatch({
            type: 'UI',
            payload: {[path]: nextValue}
          })
        return props
      }, {})
    }

    render () {
      return <Target {...this.services} {...this.props} />
    }
  }

export default mapUIServiceToProps

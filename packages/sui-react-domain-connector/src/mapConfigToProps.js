import React, {Component} from 'react'
import PropTypes from 'prop-types'

const mapConfigToProps = (...configs) => Target => {
  class DDDConfigInjector extends Component {
    static displayName = `mapConfigToProps(${Target.displayName})`
    static contextTypes = {
      domain: PropTypes.object.isRequired
    }

    render () {
      const {domain} = this.context
      const values = configs.reduce((values, config) => {
        values[`${config}Config`] = domain.get('config').get(config)
        return values
      }, {})

      return <Target {...this.props} {...values} />
    }
  }

  return DDDConfigInjector
}

export default mapConfigToProps

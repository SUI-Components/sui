import React, {Component} from 'react'
import PropTypes from 'prop-types'

const withStateValue = BaseComponent => {
  const displayName = BaseComponent.displayName

  return class BaseComponentWithState extends Component {
    static displayName = `withStateValue(${displayName})`

    static propTypes = {
      /** value */
      value: PropTypes.any,

      /** onChange callback  */
      onChange: PropTypes.func
    }

    static defaultProps = {
      onChange: () => {}
    }

    state = {
      value: this.props.value
    }

    onChange = (e, {value}) => {
      const {onChange} = this.props
      this.setState({value}, () => onChange(e, {value}))
    }

    render() {
      const {value} = this.state
      const {onChange, props} = this
      return <BaseComponent {...props} value={value} onChange={onChange} />
    }
  }
}

export default withStateValue

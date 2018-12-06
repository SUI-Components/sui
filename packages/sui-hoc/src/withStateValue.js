import React, {Component} from 'react'
import PropTypes from 'prop-types'

const withStateValue = BaseComponent => {
  return class BaseComponentWithState extends Component {
    state = {
      value: this.props.value
    }

    static propTypes = {
      /** value */
      value: PropTypes.string,

      /** onChange callback  */
      onChange: PropTypes.func
    }

    static defaultProps = {
      value: '',
      onChange: () => {}
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

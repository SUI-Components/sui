import React, {useState} from 'react'
import PropTypes from 'prop-types'

const withSwitchValue = BaseComponent => {
  const displayName = BaseComponent.displayName

  const BaseComponentWithState = ({
    value: valueFromProps = false,
    onChange: onChangeFromProps,
    ...props
  }) => {
    const [value, setValue] = useState(valueFromProps)

    const onChange = e => {
      const innerValue = !value
      setValue(innerValue)
      onChangeFromProps(e, {value: innerValue})
    }

    return <BaseComponent {...props} value={value} onChange={onChange} />
  }

  BaseComponentWithState.displayName = `withSwitchValue(${displayName})`

  BaseComponentWithState.propTypes = {
    /** value */
    value: PropTypes.any,

    /** onChange callback  */
    onChange: PropTypes.func
  }

  BaseComponentWithState.defaultProps = {
    onChange: () => {}
  }

  return BaseComponentWithState
}

export default withSwitchValue

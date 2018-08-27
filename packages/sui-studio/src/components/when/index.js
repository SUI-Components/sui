import React from 'react'
import PropTypes from 'prop-types'

const When = ({value, children}) => {
  return value ? <React.Fragment>{children()}</React.Fragment> : null
}
When.propTypes = {value: PropTypes.any, children: PropTypes.func}

export default When

import React from 'react'
import PropTypes from 'prop-types'

const When = ({value, children}) =>
  value ? <React.Fragment>{children}</React.Fragment> : null
When.propTypes = {value: PropTypes.bool, children: PropTypes.elements}

export default When

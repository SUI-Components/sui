import React from 'react'
import PropTypes from 'prop-types'

export default function Widgets (props) {
  return <div key={Math.random()}>{props.children}</div>
}
Widgets.propTypes = { children: PropTypes.node }

import React from 'react'
import PropTypes from 'prop-types'

const Header = ({children, componentID}) => (
  <header className="Header">
    <h1 className="Header-title">SUIStudio workbench ({`${componentID}`})</h1>
    <div className="Header-content">{children}</div>
  </header>
)

Header.propTypes = {
  children: PropTypes.array,
  componentID: PropTypes.string
}
export default Header

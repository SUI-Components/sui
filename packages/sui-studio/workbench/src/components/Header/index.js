import React from 'react'
import PropTypes from 'prop-types'

const Header = ({children, componentID, iframeSrc}) => (
  <header className="Header">
    <h1 className="Header-title">
      {componentID}
      <a
        className="Header-link"
        href={iframeSrc}
        rel="noopener noreferrer"
        target="_blank"
        title="Open Iframe in a new window"
      >
        ↗️
      </a>
    </h1>
    <div className="Header-content">{children}</div>
  </header>
)

Header.propTypes = {
  children: PropTypes.array,
  componentID: PropTypes.string,
  iframeSrc: PropTypes.string
}

export default Header

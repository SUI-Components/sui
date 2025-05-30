import React, {useState} from 'react'

import PropTypes from 'prop-types'

import ThemeMode from '../../../../src/components/theme-mode/index.js'

export default function Header({children, componentID, iframeSrc, themeMode, setThemeMode}) {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <header className="Header">
      <div className="Header-actions">
        <span className="Header-link">
          <ThemeMode
            mode={themeMode}
            onChange={checked => setThemeMode(checked ? 'dark' : 'light')}
            size={16}
            design="inverted"
          />
        </span>
        <a
          className="Header-link"
          href={iframeSrc}
          rel="noopener noreferrer"
          target="_blank"
          title="Open Iframe in a new window"
        >
          <svg height="21" viewBox="0 0 21 21" width="21">
            <g fill="none" stroke="currentColor" transform="translate(3 4)">
              <path
                d="m4.17157288 4.87867966v-1.41421357c0-1.56209716 1.26632995-2.82842712 2.82842712-2.82842712s2.82842712 1.26632996 2.82842712 2.82842712v1.41421357m0 2.82842712v2.82842712c0 1.5620972-1.26632995 2.8284271-2.82842712 2.8284271s-2.82842712-1.2663299-2.82842712-2.8284271v-2.82842712"
                transform="matrix(.70710678 .70710678 -.70710678 .70710678 7 -2.899495)"
              />
              <path d="m4.5 9.5 5-5" />
            </g>
          </svg>
        </a>
        <a
          className="Header-link"
          href="#"
          onClick={e => {
            e.preventDefault()
            setShow(false)
          }}
          title="Close box"
        >
          <svg height="16" viewBox="0 0 21 21" width="16">
            <g fill="none" stroke="currentColor" transform="translate(2 2)">
              <circle cx="8.5" cy="8.5" r="8" />
              <g transform="matrix(0 1 -1 0 17 0)">
                <path d="m5.5 11.5 6-6" />
                <path d="m5.5 5.5 6 6" />
              </g>
            </g>
          </svg>
        </a>
      </div>

      <h1 className="Header-title">{componentID}</h1>
      <div className="Header-content">{children}</div>
    </header>
  )
}

Header.propTypes = {
  children: PropTypes.array,
  themeMode: PropTypes.string,
  setThemeMode: PropTypes.func,
  componentID: PropTypes.string,
  iframeSrc: PropTypes.string
}

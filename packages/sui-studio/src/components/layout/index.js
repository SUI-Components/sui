import React, {useEffect, useRef, useState} from 'react'

import cx from 'classnames'
import PropTypes from 'prop-types'

import {Link} from '@s-ui/react-router'
import usePrefersColorScheme from 'use-prefers-color-scheme'

import Markdown from '../documentation/Markdown.js'
import {iconMenu} from '../icons/index.js'
import Navigation from '../navigation/index.js'
import {fetchComponentsReadme} from '../tryRequire.js'
import {getStudioName} from '../utils.js'
import Logo from './Logo.js'
import ThemeMode from '../theme-mode/index.js'

export default function Layout({children}) {
  const [readme, setReadme] = useState(null)
  const [menuIsHidden, setMenuIsHidden] = useState(false)
  const [search, setSearch] = useState('')
  const {current: studioName} = useRef(getStudioName())
  const colorScheme = usePrefersColorScheme()
  const [theme, setTheme] = useState(colorScheme)
  const {current: body} = useRef(document.body)

  const handleChange = e => {
    setSearch(e.target.value)
  }

  const handleFocus = e => {
    e.target.select()
  }

  const handleClickMenu = () => {
    setMenuIsHidden(!menuIsHidden)
  }

  useEffect(() => {
    fetchComponentsReadme().then(setReadme)
  }, [])

  useEffect(() => {
    body.dataset.themeMode = theme
  }, [theme])

  const renderReadme = () => (
    <div className="sui-Studio-readme">
      <Markdown content={readme} />
    </div>
  )

  const sidebarClassName = cx('sui-Studio-sidebar', {
    'sui-Studio-sidebar--hidden': menuIsHidden
  })

  const mainClassName = cx('sui-Studio-main', {
    'sui-Studio-main--sidebar_hidden': menuIsHidden
  })

  return (
    <section className="sui-Studio">
      <div className="sui-Studio-navHeader">
        <div className="sui-Studio-navHeaderLeft">
          <button className="sui-Studio-navMenu" onClick={handleClickMenu} aria-label="Menu">
            {iconMenu}
          </button>
          <Link to="/">
            <Logo />
            {studioName && <h1>{studioName}</h1>}
          </Link>
        </div>
        <ThemeMode mode={theme} onChange={checked => setTheme(checked ? 'dark' : 'light')} />
      </div>
      <aside className={sidebarClassName}>
        <input
          className="sui-Studio-sidebar-searchInput"
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Search"
          type="search"
          value={search}
        />
        <div className="sui-Studio-sidebarBody">
          <Navigation search={search} />
        </div>
      </aside>

      <div className={mainClassName}>
        <div className="overlay" onClick={() => setMenuIsHidden(true)} />
        {children !== null ? children : renderReadme()}
      </div>
    </section>
  )
}

Layout.propTypes = {
  children: PropTypes.element
}

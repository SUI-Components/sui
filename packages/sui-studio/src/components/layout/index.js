import React, {useEffect, useState} from 'react'

import cx from 'classnames'
import PropTypes from 'prop-types'

import {Link} from '@s-ui/react-router'

import Markdown from '../documentation/Markdown.js'
import {iconMenu} from '../icons/index.js'
import Navigation from '../navigation/index.js'
import {fetchComponentsReadme} from '../tryRequire.js'
import Logo from './Logo.js'

export default function Layout({children}) {
  const [readme, setReadme] = useState(null)
  const [menuIsHidden, setMenuIsHidden] = useState(false)
  const [search, setSearch] = useState('')

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
        <button className="sui-Studio-navMenu" onClick={handleClickMenu}>
          {iconMenu}
        </button>
        <Link to="/">
          <Logo />
        </Link>
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
        <div className="overlay" onClick={() => setMenuIsHidden(true)}>
          {' '}
        </div>
        {children !== null ? children : renderReadme()}
      </div>
    </section>
  )
}

Layout.propTypes = {
  children: PropTypes.element
}

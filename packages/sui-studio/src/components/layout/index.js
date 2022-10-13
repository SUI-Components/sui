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
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const handleClickMenu = () => {
    setMenuIsOpen(!menuIsOpen)
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
    'sui-Studio-sidebar--open': menuIsOpen
  })

  const mainClassName = cx('sui-Studio-main', {
    'sui-Studio-main--open': menuIsOpen
  })

  return (
    <section className="sui-Studio">
      <div className="sui-Studio-navHeader">
        <button className="sui-Studio-navMenu" onClick={handleClickMenu}>
          {iconMenu}
        </button>
        <Link to="/">
          <Logo />
          <h1>SUI Components</h1>
        </Link>
      </div>
      <aside className={sidebarClassName}>
        <div className="sui-Studio-sidebarBody">
          <Navigation handleClick={() => setMenuIsOpen(false)} />
        </div>
      </aside>

      <div className={mainClassName}>
        {children !== null ? children : renderReadme()}
      </div>
    </section>
  )
}

Layout.propTypes = {
  children: PropTypes.element
}

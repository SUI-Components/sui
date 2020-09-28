/* global __BASE_DIR__ */
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import {iconClose, iconMenu} from '../icons'
import Markdown from '../documentation/Markdown'
import Navigation from '../navigation'

const {
  default: readme
} = require(`raw-loader!${__BASE_DIR__}/components/README.md`)

export default function Layout({children}) {
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const handleClickMenu = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  const renderReadme = () => (
    <div className="sui-Studio-readme">
      <Markdown content={readme} />
    </div>
  )

  const sidebarClassName = cx('sui-Studio-sidebar', {
    'sui-Studio-sidebar--open': menuIsOpen
  })

  return (
    <section className="sui-Studio">
      <button className="sui-Studio-navMenu" onClick={handleClickMenu}>
        {menuIsOpen ? iconClose : iconMenu}
      </button>

      <aside className={sidebarClassName}>
        <div className="sui-Studio-sidebarBody">
          <Navigation handleClick={() => setMenuIsOpen(false)} />
        </div>
      </aside>

      <div className="sui-Studio-main">
        {children !== null ? children : renderReadme()}
      </div>
    </section>
  )
}

Layout.propTypes = {
  children: PropTypes.element
}

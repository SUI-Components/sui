/* global __BASE_DIR__ */
import PropTypes from 'prop-types'

import React, {Component} from 'react'
import Markdown from '../documentation/Markdown'
import cx from 'classnames'

import {iconClose, iconMenu} from '../icons'
import Navigation from '../navigation'

const readme = require(`raw-loader!${__BASE_DIR__}/components/README.md`)

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.element
  }

  state = {
    menuIsOpen: false
  }

  handleClickMenu = () => {
    this.setState({
      menuIsOpen: !this.state.menuIsOpen
    })
  }

  _renderReadme() {
    return (
      <div className="sui-Studio-readme">
        <Markdown content={readme} />
      </div>
    )
  }

  render() {
    const {children} = this.props
    const {menuIsOpen} = this.state

    const sidebarClassName = cx('sui-Studio-sidebar', {
      'sui-Studio-sidebar--open': menuIsOpen
    })

    return (
      <section className="sui-Studio">
        <button className="sui-Studio-navMenu" onClick={this.handleClickMenu}>
          {menuIsOpen ? iconClose : iconMenu}
        </button>

        <aside className={sidebarClassName}>
          <div className="sui-Studio-sidebarBody">
            <Navigation
              handleClick={() => {
                this.setState({menuIsOpen: false})
              }}
            />
          </div>
        </aside>

        <div className="sui-Studio-main">
          {children !== null ? children : this._renderReadme()}
        </div>
      </section>
    )
  }
}

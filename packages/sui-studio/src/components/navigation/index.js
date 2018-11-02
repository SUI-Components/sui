import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Link} from 'react-router'
import Logo from './Logo'

import {getComponentsList, getStudioName} from '../utils'

const componentsList = getComponentsList()
const studioName = getStudioName()

export default class Navigation extends Component {
  state = {search: ''}

  _handleChange = e => {
    this.setState({search: e.target.value})
  }

  _handleFocus = e => {
    e.target.select()
  }

  _filterComponentsFromSearch({search}) {
    return componentsList.filter(
      ({category, component}) =>
        category.includes(search) || component.includes(search)
    )
  }

  _renderListFilteredBySearch({handleClick, search}) {
    const filtered = this._filterComponentsFromSearch({search})
    let previousCategory = ''

    return filtered.reduce((acc, link) => {
      const {category, component} = link
      if (previousCategory !== category) {
        previousCategory = category
        acc.push(
          <li className="sui-StudioNav-menuTitle" key={category}>
            {category}
          </li>
        )
      }

      acc.push(
        <li key={`${category}${component}`}>
          <Link
            activeClassName="sui-StudioNav-menuLink--active"
            className="sui-StudioNav-menuLink"
            onClick={handleClick}
            to={`/workbench/${category}/${component}`}
          >
            <div className="sui-StudioNav-menuLinkItem">
              <span>{component}</span>
            </div>
          </Link>
        </li>
      )

      return acc
    }, [])
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.search !== this.state.search
  }

  render() {
    const {search} = this.state
    const {handleClick} = this.props

    return (
      <nav className="sui-StudioNav">
        <Link className="sui-StudioNav-header" onClick={handleClick} to="/">
          <Logo />
          <h1 className="sui-StudioNav-headerTitle">{studioName}</h1>
        </Link>

        <input
          className="sui-StudioNav-searchInput"
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          placeholder="Search component..."
          type="search"
          value={search}
        />

        <ul className="sui-StudioNav-menu">
          {this._renderListFilteredBySearch({handleClick, search})}
        </ul>
      </nav>
    )
  }
}

Navigation.propTypes = {
  handleClick: PropTypes.func,
  search: PropTypes.string
}

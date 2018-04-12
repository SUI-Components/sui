import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Link} from 'react-router'
import Logo from './Logo'
import {iconStart} from '../icons'

import {getComponentsList, getStudioName, getStudioCompliant} from '../utils'

const componentsList = getComponentsList()
const studioName = getStudioName()
const compliant = getStudioCompliant()

const SEARCH_BY_COMPLIANT = '*'

export default class Navigation extends Component {
  state = {search: ''}

  _handleChange = e => {
    this.setState({search: e.target.value})
  }

  _handleFocus = e => {
    e.target.select()
  }

  _filterComponentsFromSearch ({search}) {
    if (search === SEARCH_BY_COMPLIANT) {
      return componentsList.filter(({category, component}) =>
        this._isCompliant({category, component})
      )
    }

    return componentsList.filter(
      ({category, component}) =>
        category.includes(search) || component.includes(search)
    )
  }

  _isCompliant ({category, component}) {
    return compliant.includes(`${category}/${component}`)
  }

  _renderListFilteredBySearch ({handleClick, search}) {
    const filtered = this._filterComponentsFromSearch({search})
    let previousCategory = ''

    return filtered.reduce((acc, link) => {
      const {category, component} = link
      if (previousCategory !== category) {
        previousCategory = category
        acc.push(
          <li className='sui-StudioNav-menuTitle' key={category}>
            {category}
          </li>
        )
      }

      acc.push(
        <li key={`${category}${component}`}>
          <Link
            activeClassName='sui-StudioNav-menuLink--active'
            className='sui-StudioNav-menuLink'
            onClick={handleClick}
            to={`/workbench/${category}/${component}`}
          >
            <div className='sui-StudioNav-menuLinkItem'>
              <span>{component}</span>
              {this._isCompliant({category, component}) && (
                <i className='sui-StudioNav-menuLinkItemStart'>{iconStart}</i>
              )}
            </div>
          </Link>
        </li>
      )

      return acc
    }, [])
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.search !== this.state.search
  }

  render () {
    const {search} = this.state
    const {handleClick} = this.props

    return (
      <nav className='sui-StudioNav'>
        <Link className='sui-StudioNav-header' onClick={handleClick} to='/'>
          <Logo />
          <h1 className='sui-StudioNav-headerTitle'>{studioName}</h1>
        </Link>

        <input
          className='sui-StudioNav-searchInput'
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          placeholder='Search component...'
          type='search'
          value={search}
        />

        <ul className='sui-StudioNav-menu'>
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

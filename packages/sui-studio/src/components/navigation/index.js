import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from '@s-ui/react-router'
import Logo from './Logo'

import {getComponentsList} from '../utils'

const componentsList = getComponentsList()

export default function Navigation({handleClick}) {
  const [search, setSearch] = useState('')

  const handleChange = e => {
    setSearch(e.target.value)
  }

  const handleFocus = e => {
    e.target.select()
  }

  const filterComponentsFromSearch = ({search}) => {
    return componentsList.filter(
      ({category, component}) =>
        category.includes(search) || component.includes(search)
    )
  }

  const renderListFilteredBySearch = ({handleClick, search}) => {
    const filtered = filterComponentsFromSearch({search})
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

  return (
    <nav className="sui-StudioNav">
      <Link className="sui-StudioNav-header" onClick={handleClick} to="/">
        <Logo />
      </Link>

      <input
        className="sui-StudioNav-searchInput"
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="🔎 Search component..."
        type="search"
        value={search}
      />

      <ul className="sui-StudioNav-menu">
        {renderListFilteredBySearch({handleClick, search})}
      </ul>
    </nav>
  )
}

Navigation.propTypes = {
  handleClick: PropTypes.func
}

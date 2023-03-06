import PropTypes from 'prop-types'

import {Link} from '@s-ui/react-router'

import {getComponentsList} from '../utils.js'

const componentsList = getComponentsList()

export default function Navigation({handleClick, search}) {
  const filterComponentsFromSearch = ({search}) => {
    return componentsList.filter(({category, component}) => {
      const lowerCasedSearch = search.toLowerCase()
      return (
        category.toLowerCase().includes(lowerCasedSearch) ||
        component.toLowerCase().includes(lowerCasedSearch)
      )
    })
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
      <ul className="sui-StudioNav-menu">
        {renderListFilteredBySearch({handleClick, search})}
      </ul>
    </nav>
  )
}

Navigation.propTypes = {
  search: PropTypes.string,
  handleClick: PropTypes.func
}

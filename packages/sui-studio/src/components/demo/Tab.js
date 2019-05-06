import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'

export default function Tab({handleClick, isActive, literal}) {
  const getItemClassName = ({isActive}) =>
    cx('sui-StudioTabs-button', {
      'sui-StudioTabs-button--active': isActive
    })

  return (
    <li className="sui-StudioTabs-tab">
      <button className={getItemClassName({isActive})} onClick={handleClick}>
        {literal}
      </button>
    </li>
  )
}

Tab.propTypes = {
  handleClick: PropTypes.func,
  isActive: PropTypes.bool,
  literal: PropTypes.string
}

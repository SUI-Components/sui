import PropTypes from 'prop-types'
import cx from 'classnames'

export default function Tab({handleClick, isActive, literal}) {
  const className = cx('sui-StudioTabs-button', {
    'sui-StudioTabs-button--active': isActive
  })

  return (
    <li className="sui-StudioTabs-tab">
      <button className={className} onClick={handleClick}>
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

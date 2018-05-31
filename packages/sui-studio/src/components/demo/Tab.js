import PropTypes from 'prop-types'
import React, {Component} from 'react'
import cx from 'classnames'

export default class Tab extends Component {
  static propTypes = {
    handleClick: PropTypes.func,
    isActive: PropTypes.bool,
    literal: PropTypes.string
  }

  _getItemClassName({isActive}) {
    return cx('sui-StudioTabs-button', {
      'sui-StudioTabs-button--active': isActive
    })
  }

  render() {
    const {handleClick, isActive, literal} = this.props

    return (
      <li className="sui-StudioTabs-tab">
        <button
          className={this._getItemClassName({isActive})}
          onClick={handleClick}
        >
          {literal}
        </button>
      </li>
    )
  }
}

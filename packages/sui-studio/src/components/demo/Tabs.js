import React, { Component, PropTypes } from 'react'

export default class Tabs extends Component {
  static propTypes = {
    children: PropTypes.any,
    title: PropTypes.string
  }

  render () {
    const { title } = this.props

    return (
      <ul className='sui-StudioTabs sui-StudioTabs--small'>
        <li className='sui-StudioTabs-title'>
          {title}
        </li>
        {this.props.children}
      </ul>
    )
  }
}

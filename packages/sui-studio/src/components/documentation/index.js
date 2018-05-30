import PropTypes from 'prop-types'
import React, {Component} from 'react'

export default class Documentation extends Component {
  static propTypes = {
    children: PropTypes.element
  }

  render() {
    return (
      <div className="sui-StudioDocumentation">
        <div className="sui-StudioDocumentation-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

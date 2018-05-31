import React, {Component} from 'react'
import {getStudioLogo} from '../utils'

export default class Logo extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <picture
        className="sui-Studio-logo"
        dangerouslySetInnerHTML={{__html: getStudioLogo()}}
      />
    )
  }
}

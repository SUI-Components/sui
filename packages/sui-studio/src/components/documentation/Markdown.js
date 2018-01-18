import PropTypes from 'prop-types'
import React, { Component } from 'react'
import snarkdown from 'snarkdown'

export default class Markdown extends Component {
  propTypes = {
    content: PropTypes.string
  }

  render () {
    const {content} = this.props
    return (content &&
      <div
        className='markdown-body'
        dangerouslySetInnerHTML={{ __html: snarkdown(content) }} />
    )
  }
}

Markdown.displayName = 'Markdown'

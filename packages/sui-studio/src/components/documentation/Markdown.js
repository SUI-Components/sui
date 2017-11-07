import PropTypes from 'prop-types'
import React, { Component } from 'react'
import showdown from 'showdown'
import renderHTML from 'react-render-html'

const converter = new showdown.Converter()
converter.setOption('tables', true)
converter.setOption('simpleLineBreaks', true)
converter.setOption('ghCompatibleHeaderId', true)
converter.setFlavor('github')

export default class Markdown extends Component {
  propTypes = {
    content: PropTypes.string
  }

  render () {
    const {content} = this.props
    return (content &&
      <div className='markdown-body'>
        {renderHTML(converter.makeHtml(content))}
      </div>
    )
  }
}

Markdown.displayName = 'Markdown'

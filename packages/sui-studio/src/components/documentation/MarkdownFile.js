import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Markdown from './Markdown'
import tryRequire from './try-require'

export default class MarkdownFile extends Component {
  propTypes = {
    params: PropTypes.object,
    file: PropTypes.string
  }

  state = {
    content: false
  }

  componentDidMount () {
    const {file} = this.props
    tryRequire(this.props.params).then(([_, readme, changelog]) => {
      this.setState({content: file === 'CHANGELOG' ? changelog : readme})
    })
  }

  render () {
    const { content } = this.state
    return (content && <Markdown content={content} />)
  }
}

MarkdownFile.displayName = 'MarkdownFile'

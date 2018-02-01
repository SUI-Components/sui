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
    const section = file === 'CHANGELOG' ? 'changelog' : 'readme'

    tryRequire({...this.props.params, section})
      .then(content => {
        console.log(content)
        this.setState({ content })
      })
  }

  render () {
    const { content } = this.state
    return (content && <Markdown content={content} />)
  }
}

MarkdownFile.displayName = 'MarkdownFile'

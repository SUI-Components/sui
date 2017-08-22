import React, {Component, PropTypes} from 'react'
import ReactMarkdown from 'react-markdown'

import tryRequire from './try-require'

export default class Markdown extends Component {
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
    return (
      content &&
        <ReactMarkdown
          className='sui-StudioMarkdown-body markdown-body'
          source={content}
        />
    )
  }
}

Markdown.displayName = 'Markdown'

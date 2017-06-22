import React, {Component, PropTypes} from 'react'
import ReactMarkdown from 'react-markdown'

import tryRequire from './try-require'

export default class Markdown extends Component {
  propTypes = {
    params: PropTypes.object
  }

  state = {
    readme: false
  }

  componentDidMount () {
    tryRequire(this.props.params).then(([_, readme]) => this.setState({readme}))
  }

  render () {
    const { readme } = this.state
    return (
      readme &&
        <ReactMarkdown
          className='sui-StudioMarkdown-body markdown-body'
          source={readme}
        />
    )
  }
}

Markdown.displayName = 'Markdown'

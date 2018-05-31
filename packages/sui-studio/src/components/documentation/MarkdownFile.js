import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Markdown from './Markdown'
import {tryRequireMarkdown} from '../tryRequire'

export default class MarkdownFile extends Component {
  propTypes = {
    params: PropTypes.object,
    file: PropTypes.string
  }

  state = {
    content: false
  }

  async componentDidMount() {
    const {file, params} = this.props
    const content = await tryRequireMarkdown({...params, file})
    this.setState({content})
  }

  render() {
    const {content} = this.state
    return content && <Markdown content={content} />
  }
}

MarkdownFile.displayName = 'MarkdownFile'

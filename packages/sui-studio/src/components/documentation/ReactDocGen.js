import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Markdown from './Markdown'
import tryRequire from './try-require'
import docsToMarkdown from 'react-docs-markdown'
const reactDocs = require('react-docgen')

class ReactDocGen extends Component {
  static propTypes = {
    params: PropTypes.shape({
      category: PropTypes.string,
      component: PropTypes.string
    })
  }

  state = { parsed: false }

  componentDidMount () {
    tryRequire(this.props.params).then(([src, _]) => this.setState({parsed: reactDocs.parse(src)}))
  }

  render () {
    const {parsed} = this.state
    let markdown = null
    if (parsed) {
      const {params: {category, component}} = this.props
      const componentTitle = `${parsed.displayName} (${category}/${component})`
      markdown = docsToMarkdown(parsed, componentTitle)
    }
    return (markdown && <Markdown content={markdown} />)
  }
}

ReactDocGen.displayName = 'ReactDocGen'

export default ReactDocGen

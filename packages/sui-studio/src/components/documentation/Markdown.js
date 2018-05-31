import PropTypes from 'prop-types'
import React, {Component} from 'react'

export default class Markdown extends Component {
  propTypes = {
    content: PropTypes.string
  }

  state = {
    dependenciesReady: false
  }

  async componentDidMount() {
    const snarkdownDependency = await import('snarkdown')
    this._snarkdown = snarkdownDependency.default
    this.setState({dependenciesReady: true})
  }

  render() {
    if (this.state.dependenciesReady === false) return null

    const {content} = this.props
    return (
      content && (
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{__html: this._snarkdown(content)}}
        />
      )
    )
  }
}

Markdown.displayName = 'Markdown'

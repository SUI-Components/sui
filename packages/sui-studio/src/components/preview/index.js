/* eslint no-console: 0 */
import PropTypes from 'prop-types'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import SUIContext from '@s-ui/react-context'

const ERROR_TIMEOUT = 500

export default class Preview extends Component {
  static propTypes = {
    code: PropTypes.string,
    scope: PropTypes.object
  }

  static defaultProps = {
    scope: {React}
  }

  state = {
    error: undefined
  }

  componentDidMount() {
    this.executeCode()
  }

  componentDidUpdate(prevProps) {
    try {
      this.executeCode()
    } finally {
      clearTimeout(this.timeoutID)
    }
  }

  setTimeout() {
    clearTimeout(this.timeoutID)
    this.timeoutID = setTimeout(...arguments)
  }

  compileCode() {
    const code = `
      (function (${Object.keys(this.props.scope).join(', ')}, mountNode) {
        ${this.props.code}
      });`

    return window.Babel.transform(code, {
      presets: ['es2015', 'stage-3', 'react']
    }).code
  }

  buildScope(mountNode) {
    return Object.keys(this.props.scope)
      .map(key => this.props.scope[key])
      .concat(mountNode)
  }

  executeCode() {
    if (this.props.code === undefined) {
      return
    }
    const mountNode = this.refs.mount
    const scope = this.buildScope(mountNode)

    try {
      ReactDOM.unmountComponentAtNode(mountNode)
    } catch (e) {
      console.error(e)
    }

    try {
      const compiledCode = this.compileCode()
      /* eslint-disable no-eval */
      const Component = eval(compiledCode)(...scope)
      ReactDOM.render(
        <SUIContext.Provider value={this.props.scope.context}>
          {Component}
        </SUIContext.Provider>,
        mountNode
      )
      if (this.state.error) {
        this.setState({error: undefined})
      }
    } catch (err) {
      console.error(err)
      this.setTimeout(() => {
        this.setState({error: err.toString()})
      }, ERROR_TIMEOUT)
    }
  }

  _renderError({error}) {
    return (
      <pre className="sui-StudioPreview-error">
        <h3>Your playground has an error, please check:</h3>
        {error}
      </pre>
    )
  }

  render() {
    const {error} = this.state

    return (
      <div className="sui-StudioPreview">
        {error !== undefined && this._renderError({error})}
        <div
          ref="mount"
          className="sui-StudioPreview-content sui-StudioDemo-preview"
        />
      </div>
    )
  }
}

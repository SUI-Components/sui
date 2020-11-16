/* eslint no-console: 0 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SUIContext from '@s-ui/react-context'
import {transform} from '@babel/standalone'

const TRANSFORM_PRESETS = {
  presets: ['es2015-loose', 'stage-3', 'react']
}

const getCompiledCode = ({code, scope}) => {
  const codeToCompile = `
    (function (${Object.keys(scope).join(', ')}, mountNode) {
      ${code}
    });`

  return transform(codeToCompile, TRANSFORM_PRESETS).code
}

class ErrorRenderBoundary extends Component {
  state = {error: null}

  static propTypes = {
    children: PropTypes.element
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    if (this.state.error) {
      return (
        <div className="sui-StudioPreview-error">
          <h3>Your playground has an error, please check:</h3>
          <p>{this.state.error.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default function Preview({code, scope = {React}}) {
  const renderCode = () => {
    const compiledCode = getCompiledCode({code, scope})
    const Component = eval(compiledCode)(...Object.values(scope)) // eslint-disable-line

    return (
      <SUIContext.Provider value={scope.context}>
        {Component}
      </SUIContext.Provider>
    )
  }

  return (
    <div className="sui-StudioPreview">
      <ErrorRenderBoundary>
        <div className="sui-StudioPreview-content sui-StudioDemo-preview">
          {renderCode()}
        </div>
      </ErrorRenderBoundary>
    </div>
  )
}

Preview.propTypes = {
  code: PropTypes.string,
  scope: PropTypes.object
}

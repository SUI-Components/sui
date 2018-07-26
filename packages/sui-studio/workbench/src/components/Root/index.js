/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import PropTypes from 'prop-types'
import {hot} from 'react-hot-loader'

import Header from '../Header'
import Preview from '../../../../src/components/preview'
import CodeMirror from '../CodeMirror'

import {createStore} from '@s-ui/react-domain-connector'
import withContext from '../../../../src/components/demo/HoC/withContext'
import withProvider from '../../../../src/components/demo/HoC/withProvider'
import {
  DEFAULT_CONTEXT,
  createContextByType,
  checkIfPackageHasProvider,
  cleanDisplayName,
  pipe,
  removeDefaultContext
} from '../../../../src/components/demo/utilities'

import playground from '!raw-loader!demo/playground'
import 'component/index.scss'

import Component, * as named from 'component'
import pkg from 'package'

const nonDefault = removeDefaultContext(named)
const hasProvider = checkIfPackageHasProvider(pkg)

class Root extends React.PureComponent {
  static propTypes = {contexts: PropTypes.object}

  state = {playground, actualContext: DEFAULT_CONTEXT}

  render() {
    const {playground, actualContext} = this.state
    const {contexts} = this.props

    const contextTypes =
      Component.contextTypes || Component.originalContextTypes
    const context = contextTypes && createContextByType(contexts, actualContext)
    const {domain} = context || {}
    const store = domain && hasProvider && createStore(domain)
    const Enhance = pipe(
      withContext(contextTypes && context, context),
      withProvider(hasProvider, store)
    )(Component)

    return (
      <div className="Root">
        <div className="Root-top">
          <Header />
        </div>
        <div className="Root-center">
          <CodeMirror
            onChange={this.handleChangeCodeMirror}
            playground={playground}
          />
          <Preview
            scope={{
              React,
              [`${cleanDisplayName(Enhance.displayName)}`]: Enhance,
              ...nonDefault
            }}
            code={playground}
          />
        </div>
        <div className="Root-bottom" />
      </div>
    )
  }

  handleChangeCodeMirror = playground => this.setState({playground})
}

export default hot(module)(Root)

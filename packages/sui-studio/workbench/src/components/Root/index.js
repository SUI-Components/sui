/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import PropTypes from 'prop-types'
import {hot} from 'react-hot-loader'

import Header from '../Header'
import Select from '../Select'
import Preview from '../../../../src/components/preview'
import CodeMirror from '../CodeMirror'

import {createStore} from '@s-ui/react-domain-connector'
import withContext from '../../../../src/components/demo/HoC/withContext'
import withProvider from '../../../../src/components/demo/HoC/withProvider'
import Style from '../../../../src/components/style'
import {
  createContextByType,
  checkIfPackageHasProvider,
  cleanDisplayName,
  pipe,
  removeDefaultContext
} from '../../../../src/components/demo/utilities'

import playground from '!raw-loader!demo/playground'

import Component, * as named from 'component'
import pkg from 'package'

const nonDefault = removeDefaultContext(named)
const hasProvider = checkIfPackageHasProvider(pkg)

class Root extends React.PureComponent {
  static propTypes = {
    contexts: PropTypes.object,
    themes: PropTypes.object,
    componentID: PropTypes.string
  }

  state = {playground, actualContext: 'default', actualStyle: 'default'}

  render() {
    const {playground, actualContext, actualStyle} = this.state
    const {contexts, themes, componentID} = this.props

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
        <Style>{themes[actualStyle]}</Style>

        <div className="Root-top">
          <Header componentID={componentID}>
            <Select
              label={'Contexts'}
              options={contexts}
              initValue={'default'}
              onChange={nextValue => this.setState({actualContext: nextValue})}
            />
            <Select
              label={'Themes'}
              options={themes}
              initValue={'default'}
              onChange={nextValue => this.setState({actualStyle: nextValue})}
            />
          </Header>
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

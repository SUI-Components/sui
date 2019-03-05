/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import PropTypes from 'prop-types'
import {hot} from 'react-hot-loader'

import Header from '../Header'
import Select from '../Select'
import Preview from '../../../../src/components/preview'
import CodeMirror from '../CodeMirror'

import SUIContext from '@s-ui/react-context'
import {createStore} from '@s-ui/react-domain-connector'
import withContext from '../../../../src/components/demo/HoC/withContext'
import withProvider from '../../../../src/components/demo/HoC/withProvider'
import Style from '../../../../src/components/style'
import When from '../../../../src/components/when'
import ShadowDOM from 'react-shadow'

import {
  createContextByType,
  checkIfPackageHasProvider,
  cleanDisplayName,
  pipe,
  removeDefaultContext
} from '../../../../src/components/demo/utilities'

import Component, * as named from 'component'
import pkg from 'package'

let playground
try {
  playground = require('!raw-loader!demo/playground')
} catch (e) {}

const EMPTY = 0
const nonDefault = removeDefaultContext(named)
const hasProvider = checkIfPackageHasProvider(pkg)

class Root extends React.PureComponent {
  static propTypes = {
    componentID: PropTypes.string,
    contexts: PropTypes.object,
    demo: PropTypes.node,
    themes: PropTypes.object
  }

  state = {
    playground,
    actualContext: window.sessionStorage.actualContext || 'default',
    actualStyle: window.sessionStorage.actualStyle || 'default'
  }

  render() {
    const {playground, actualContext, actualStyle} = this.state
    const {contexts = {}, themes, componentID, demo: DemoComponent} = this.props

    const context =
      Object.keys(contexts).length !== EMPTY &&
      createContextByType(contexts, actualContext)
    const {domain} = context || {}
    const store = domain && hasProvider && createStore(domain)

    const Enhance = pipe(
      withContext(context, context),
      withProvider(hasProvider, store)
    )(Component)

    const EnhanceDemoComponent =
      DemoComponent &&
      pipe(
        withContext(context, context),
        withProvider(hasProvider, store)
      )(DemoComponent)
    return (
      <div className="Root">
        <Style>{themes[actualStyle]}</Style>

        <div className="Root-top">
          <Header componentID={componentID}>
            <Select
              label={'Contexts'}
              options={contexts}
              initValue={actualContext}
              onChange={nextValue => {
                window.sessionStorage.setItem('actualContext', nextValue)
                this.setState({actualContext: nextValue})
              }}
            />
            <Select
              label={'Themes'}
              options={themes}
              initValue={actualStyle}
              onChange={nextValue => {
                window.sessionStorage.setItem('actualStyle', nextValue)
                this.setState({actualStyle: nextValue})
              }}
            />
          </Header>
        </div>
        <div className="Root-center">
          <When value={!EnhanceDemoComponent && playground}>
            {() => (
              <React.Fragment>
                <CodeMirror
                  onChange={this.handleChangeCodeMirror}
                  playground={playground}
                />
                <ShadowDOM nodeName="div" key={playground}>
                  <div>
                    <style type="text/css">{themes[actualStyle]}</style>
                    <Preview
                      scope={{
                        context,
                        React,
                        [`${cleanDisplayName(Enhance.displayName)}`]: Enhance,
                        ...nonDefault
                      }}
                      code={playground}
                    />
                  </div>
                </ShadowDOM>
              </React.Fragment>
            )}
          </When>
          <When value={EnhanceDemoComponent}>
            {() => (
              <SUIContext.Provider value={context}>
                <ShadowDOM nodeName="div" key={playground}>
                  <div>
                    <style type="text/css">{themes[actualStyle]}</style>
                    <EnhanceDemoComponent />
                  </div>
                </ShadowDOM>
              </SUIContext.Provider>
            )}
          </When>
        </div>
        <div className="Root-bottom" />
      </div>
    )
  }

  handleChangeCodeMirror = playground => this.setState({playground})
}

export default hot(module)(Root)

/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import PropTypes from 'prop-types'

import Preview from '../../../../src/components/preview'

import SUIContext from '@s-ui/react-context'
import withContext from '../../../../src/components/demo/HoC/withContext'
import Style from '../../../../src/components/style'
import When from '../../../../src/components/when'
import {
  createContextByType,
  cleanDisplayName,
  pipe,
  removeDefaultContext,
  interOps
} from '../../../../src/components/demo/utilities'

import Component, * as named from 'component'

import './index.scss'

let playground
try {
  playground = interOps(require('!raw-loader!demo/playground'))
} catch (e) {}

const EMPTY = 0
const nonDefault = removeDefaultContext(named)

class Raw extends React.PureComponent {
  static propTypes = {
    actualContext: PropTypes.string,
    actualStyle: PropTypes.string,
    contexts: PropTypes.object,
    demo: PropTypes.node,
    demoStyles: PropTypes.string,
    themes: PropTypes.object
  }

  state = {
    playground,
    actualContext: this.props.actualContext || 'default',
    actualStyle: this.props.actualStyle || 'default'
  }

  render() {
    const {playground, actualContext, actualStyle} = this.state
    const {contexts = {}, themes, demo: DemoComponent, demoStyles} = this.props

    const context =
      Object.keys(contexts).length !== EMPTY &&
      createContextByType(contexts, actualContext)

    // check if is a normal component or it's wrapped with a React.memo method
    const ComponentToRender = Component.type ? Component.type : Component
    const Enhance = pipe(withContext(context, context))(ComponentToRender)

    const EnhanceDemoComponent =
      DemoComponent && pipe(withContext(context, context))(DemoComponent)

    return (
      <div className="Raw">
        <Style>{themes[actualStyle]}</Style>
        <Style>{demoStyles}</Style>

        <div className="Raw-center">
          <When value={!EnhanceDemoComponent && playground}>
            {() => (
              <>
                <Preview
                  scope={{
                    context,
                    React,
                    [`${cleanDisplayName(Enhance.displayName)}`]: Enhance,
                    ...nonDefault
                  }}
                  code={playground}
                />
              </>
            )}
          </When>
          <When value={EnhanceDemoComponent}>
            {() => (
              <SUIContext.Provider value={context}>
                <EnhanceDemoComponent />
              </SUIContext.Provider>
            )}
          </When>
        </div>
      </div>
    )
  }

  handleChangeCodeMirror = playground => this.setState({playground})
}

export default Raw

/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import PropTypes from 'prop-types'
import SUIContext from '@s-ui/react-context'

import Preview from '../../../../src/components/preview'
import Style from '../../../../src/components/style'
import {
  createContextByType,
  cleanDisplayName,
  removeDefaultContext
} from '../../../../src/components/demo/utilities'

import Component, * as named from 'component'

import './index.scss'
let playground
try {
  playground = require('!raw-loader!demo/playground').default
} catch (e) {}

const nonDefault = removeDefaultContext(named)

export default function Raw({
  actualContext = 'default',
  actualStyle = 'default',
  contexts = {},
  demo: DemoComponent,
  demoStyles,
  themes
}) {
  const context =
    Object.keys(contexts).length && createContextByType(contexts, actualContext)

  // check if is a normal component or it's wrapped with a React.memo method
  const ComponentToRender = Component.type ? Component.type : Component

  return (
    <div className="Raw">
      <Style id="sui-studio-raw-demo">{demoStyles}</Style>
      <Style id="sui-studio-raw-theme">{themes[actualStyle]}</Style>

      <div className="Raw-center">
        {!DemoComponent && playground && (
          <Preview
            scope={{
              context,
              React,
              [cleanDisplayName(
                ComponentToRender.displayName
              )]: ComponentToRender,
              ...nonDefault
            }}
            code={playground}
          />
        )}
        {DemoComponent && (
          <SUIContext.Provider value={context}>
            <DemoComponent />
          </SUIContext.Provider>
        )}
      </div>
    </div>
  )
}

Raw.propTypes = {
  actualContext: PropTypes.string,
  actualStyle: PropTypes.string,
  contexts: PropTypes.object,
  demo: PropTypes.node,
  demoStyles: PropTypes.string,
  themes: PropTypes.object
}

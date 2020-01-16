/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import PropTypes from 'prop-types'
import SUIContext from '@s-ui/react-context'

import Preview from '../../../../src/components/preview'
import withContext from '../../../../src/components/demo/HoC/withContext'
import Style from '../../../../src/components/style'
import When from '../../../../src/components/when'
import {
  createContextByType,
  cleanDisplayName,
  pipe,
  removeDefaultContext
} from '../../../../src/components/demo/utilities'

import Component, * as named from 'component'

import './index.scss'

let playground
try {
  playground = require('!raw-loader!demo/playground')
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
            <Preview
              scope={{
                context,
                React,
                [cleanDisplayName(Enhance.displayName)]: Enhance,
                ...nonDefault
              }}
              code={playground}
            />
          )}
        </When>
        {EnhanceDemoComponent && (
          <SUIContext.Provider value={context}>
            <EnhanceDemoComponent />
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

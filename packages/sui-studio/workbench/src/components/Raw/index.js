/* eslint import/no-webpack-loader-syntax:0 */
import React, {useEffect, useRef, useState} from 'react'

import Component, * as named from 'component'
import PropTypes from 'prop-types'

import SUIContext from '@s-ui/react-context'
import {useRouter} from '@s-ui/react-router'

import {cleanDisplayName, createContextByType, removeDefaultContext} from '../../../../src/components/demo/utilities.js'
import Preview from '../../../../src/components/preview/index.js'
import Style from '../../../../src/components/style/index.js'
import {fetchPlayground} from '../../../../src/components/tryRequire.js'

import './index.scss'

const nonDefault = removeDefaultContext(named)

export default function Raw({
  actualContext = 'default',
  actualStyle = 'default',
  componentID,
  contexts = {},
  demo: DemoComponent,
  themes
}) {
  const {
    location: {
      query: {mode: themeMode = 'light'}
    }
  } = useRouter()
  const rawRef = useRef()
  const [playground, setPlayground] = useState(null)

  const context = Object.keys(contexts).length && createContextByType(contexts, actualContext)

  // check if is a normal component, or it's wrapped with a React.memo method
  const ComponentToRender = Component.type ? Component.type : Component

  useEffect(() => {
    const [category, component] = componentID.split('/')
    fetchPlayground({category, component}).then(setPlayground)
  }, [componentID])

  return (
    <div className="Raw" ref={rawRef} data-theme-mode={themeMode}>
      <Style id="sui-studio-raw-theme">{themes[actualStyle]}</Style>

      <div className="Raw-center">
        {!DemoComponent && playground && (
          <Preview
            scope={{
              context,
              React,
              [cleanDisplayName(ComponentToRender.displayName)]: ComponentToRender,
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
  componentID: PropTypes.string,
  contexts: PropTypes.object,
  demo: PropTypes.node,
  themes: PropTypes.object
}

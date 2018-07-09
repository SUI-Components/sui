/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import {hot} from 'react-hot-loader'

import Preview from '../../../../src/components/preview'

import playground from '!raw-loader!demo/playground'
import 'component/index.scss'

import Component, * as named from 'component'

const nonDefault = Object.keys(named).reduce((acc, key) => {
  if (key !== 'default') {
    acc[key] = named[key]
  }
  return acc
}, {})

class Root extends React.PureComponent {
  render() {
    return (
      <div className="Root">
        <div className="Root-top">Header</div>
        <div className="Root-center">
          <Component label="9.5 / 10" />
          <Preview
            scope={{React, [Component.displayName]: Component, ...nonDefault}}
            code={playground}
          />
        </div>
        <div className="Root-bottom">Footer</div>
      </div>
    )
  }
}

export default hot(module)(Root)

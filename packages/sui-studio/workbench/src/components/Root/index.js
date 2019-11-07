/* eslint import/no-webpack-loader-syntax:0 */
/* global __EXPERIMENTAL_TEST__ */

import React from 'react'
import PropTypes from 'prop-types'

import Header from '../Header'
import Select from '../Select'
import Test from '../../../../src/components/test'

import When from '../../../../src/components/when'

const DEVICES = {
  mobile: {
    width: 362,
    height: 642
  },
  tablet: {
    width: 768,
    height: 1024
  },
  desktop: {
    width: '100%',
    height: '100%'
  }
}

const importComponent = () => import('component/index.js')
const importTest = () => import('test/index.js')

class Root extends React.PureComponent {
  static propTypes = {
    componentID: PropTypes.string,
    contexts: PropTypes.object,
    demo: PropTypes.node,
    demoStyles: PropTypes.string,
    themes: PropTypes.object
  }

  state = {
    actualContext: window.sessionStorage.actualContext || 'default',
    actualStyle: window.sessionStorage.actualStyle || 'default',
    actualDevice: window.sessionStorage.actualDevice || 'mobile'
  }

  render() {
    const {actualContext, actualStyle, actualDevice} = this.state
    const {contexts = {}, themes, componentID} = this.props
    return (
      <div className="Root">
        <div className="Root-top">
          <Header componentID={componentID}>
            <Select
              label="Contexts"
              options={contexts}
              initValue={actualContext}
              onChange={nextValue => {
                window.sessionStorage.setItem('actualContext', nextValue)
                this.setState({actualContext: nextValue})
              }}
            />
            <Select
              label="Themes"
              options={themes}
              initValue={actualStyle}
              onChange={nextValue => {
                window.sessionStorage.setItem('actualStyle', nextValue)
                this.setState({actualStyle: nextValue})
              }}
            />
            <Select
              label="Devices"
              options={DEVICES}
              initValue={actualDevice}
              onChange={nextValue => {
                window.sessionStorage.setItem('actualDevice', nextValue)
                this.setState({actualDevice: nextValue})
              }}
            />
          </Header>
        </div>
        <div className={`Root-center`}>
          <div className={`Root-${actualDevice}`}>
            <span className={`Root-${actualDevice}-camera`} />
            <span className={`Root-${actualDevice}-speaker`} />
            <span className={`Root-${actualDevice}-button`} />
            <iframe
              style={{
                width: DEVICES[actualDevice].width,
                height: DEVICES[actualDevice].height,
                zoom: 1,
                display: 'block',
                margin: '10px auto',
                overflow: 'scroll',
                backgroundColor: '#fff',
                border: '1px solid gray'
              }}
              src={`/?raw=true&actualStyle=${actualStyle}&actualContext=${actualContext}`}
              scrolling="yes"
            />
          </div>
          <When value={__EXPERIMENTAL_TEST__}>
            {() => (
              <div className={`Root-test`}>
                <Test
                  open
                  context={contexts[actualContext]}
                  importComponent={importComponent}
                  importTest={importTest}
                />
              </div>
            )}
          </When>
        </div>

        <div className="Root-bottom" />
      </div>
    )
  }
}

export default Root

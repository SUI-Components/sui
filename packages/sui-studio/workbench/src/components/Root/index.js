/* eslint import/no-webpack-loader-syntax:0 */
import React from 'react'
import PropTypes from 'prop-types'

import Header from '../Header'
import Select from '../Select'

const DEVICES = {
  mobile: {
    width: 360,
    height: 640
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
            <Select
              label={'Devices'}
              options={DEVICES}
              initValue={actualDevice}
              onChange={nextValue => {
                window.sessionStorage.setItem('actualDevice', nextValue)
                this.setState({actualDevice: nextValue})
              }}
            />
          </Header>
        </div>
        <div className="Root-center">
          <iframe
            style={{
              width: DEVICES[actualDevice].width,
              height: DEVICES[actualDevice].height,
              zoom: 1,
              display: 'block',
              margin: '10px auto',
              overflow: 'scroll',
              backgroundColor: '#fff',
              border: 0
            }}
            src={`/?raw=true&actualStyle=${actualStyle}&actualContext=${actualContext}`}
            scrolling="yes"
          />
        </div>
        <div className="Root-bottom" />
      </div>
    )
  }
}

export default Root

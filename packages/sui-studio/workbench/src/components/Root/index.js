/* eslint import/no-webpack-loader-syntax:0 */
import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Header from '../Header'
import Select from '../Select'

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

const getFromStorage = (key, defaultValue) =>
  window.sessionStorage[key] || defaultValue

const updateOnChange = (setState, sessionKey) => nextValue => {
  window.sessionStorage.setItem(sessionKey, nextValue)
  setState(nextValue)
}

export default function Root({componentID, contexts = {}, themes}) {
  const [actualContext, setActualContext] = useState(
    getFromStorage('actualContext', 'default')
  )
  const [actualStyle, setActualStyle] = useState(
    getFromStorage('actualStyle', 'default')
  )
  const [actualDevice, setActualDevice] = useState(
    getFromStorage('actualDevice', 'mobile')
  )

  const {width, height} = DEVICES[actualDevice]
  const iframeSrc = `/?raw=true&actualStyle=${actualStyle}&actualContext=${actualContext}`

  return (
    <div className="Root">
      <div className="Root-top">
        <Header componentID={componentID} iframeSrc={iframeSrc}>
          <Select
            label="Contexts"
            options={contexts}
            initValue={actualContext}
            onChange={updateOnChange(setActualContext, 'actualContext')}
          />
          <Select
            label="Themes"
            options={themes}
            initValue={actualStyle}
            onChange={updateOnChange(setActualStyle, 'actualStyle')}
          />
          <Select
            label="Devices"
            options={DEVICES}
            initValue={actualDevice}
            onChange={updateOnChange(setActualDevice, 'actualDevice')}
          />
        </Header>
      </div>
      <div className={`Root-center Root-${actualDevice}`}>
        <span className={`Root-${actualDevice}-camera`} />
        <span className={`Root-${actualDevice}-speaker`} />
        <span className={`Root-${actualDevice}-button`} />
        <iframe
          className="Root-iframe"
          style={{width, height}}
          src={iframeSrc}
          scrolling="yes"
        />
      </div>
      <div className="Root-bottom" />
    </div>
  )
}

Root.propTypes = {
  componentID: PropTypes.string,
  contexts: PropTypes.object,
  themes: PropTypes.object
}

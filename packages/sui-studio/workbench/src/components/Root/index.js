import React, {useState} from 'react'
import PropTypes from 'prop-types'

import Header from '../Header'
import Select from '../Select'
import Test from '../Test'

const importComponent = () => import('component/index.js')
const importTest = () => import('test/index.js')

const getFromStorage = (key, defaultValue) =>
  window.sessionStorage[key] || defaultValue

const updateOnChange = (setState, sessionKey) => nextValue => {
  window.sessionStorage.setItem(sessionKey, nextValue)
  setState(nextValue)
}

export default function Root({componentID, contexts = {}, themes}) {
  const [actualContext, setActualContext] = useState(() =>
    getFromStorage('actualContext', 'default')
  )
  const [actualStyle, setActualStyle] = useState(() =>
    getFromStorage('actualStyle', 'default')
  )
  const [showTests, setShowTests] = useState(() =>
    getFromStorage('showTests', 'show')
  )

  const iframeSrc = `/?raw=true&actualStyle=${actualStyle}&actualContext=${actualContext}`

  return (
    <div className="Root">
      <Header componentID={componentID} iframeSrc={iframeSrc}>
        <Select
          label="contexts"
          options={contexts}
          initValue={actualContext}
          onChange={updateOnChange(setActualContext, 'actualContext')}
        />
        <Select
          label="themes"
          options={themes}
          initValue={actualStyle}
          onChange={updateOnChange(setActualStyle, 'actualStyle')}
        />
        <button
          className="Root-testSwitch"
          onClick={() => {
            updateOnChange(
              setShowTests,
              'showTests'
            )(showTests === 'show' ? 'hide' : 'show')
          }}
        >
          {showTests === 'show' ? 'Close Tests' : 'Open Tests'}
        </button>
      </Header>

      <iframe src={iframeSrc} scrolling="yes" title="Demo" />
      <div className="Root-test" hidden={showTests === 'hide'}>
        <Test
          open
          contexts={contexts}
          importComponent={importComponent}
          importTest={importTest}
        />
      </div>
    </div>
  )
}

Root.propTypes = {
  componentID: PropTypes.string,
  contexts: PropTypes.object,
  themes: PropTypes.object
}

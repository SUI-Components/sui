import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import hoistNonReactStatics from 'hoist-non-react-statics'

import SUIContext from '@s-ui/react-context'
import withContext from '../demo/HoC/withContext'
import {cleanDisplayName} from '../demo/utilities'

const BASE_CLASSNAME = 'sui-Test'

const Test = ({open, importTest, importComponent, contexts}) => {
  const [failures, setFailures] = useState(0)
  const [notFoundTest, setNotFoundTest] = useState(false)

  const classnames = cx(BASE_CLASSNAME, {
    [`${BASE_CLASSNAME}--open`]: open,
    [`${BASE_CLASSNAME}--failures`]: failures
  })

  useEffect(() => {
    importComponent().then(async module => {
      const Component = module.default || module

      const nextContexts =
        typeof contexts !== 'function' ? contexts : await contexts()

      window.__STUDIO_CONTEXTS__ = nextContexts
      window.__STUDIO_COMPONENT__ = Component

      const EnhanceComponent = withContext(
        nextContexts.default,
        nextContexts
      )(Component)
      !EnhanceComponent.displayName &&
        console.error('[sui-Test] Component without displayName') // eslint-disable-line

      const NextComponent = props => (
        <SUIContext.Provider value={nextContexts.default}>
          <EnhanceComponent {...props} />
        </SUIContext.Provider>
      )
      hoistNonReactStatics(NextComponent, Component)

      const displayName = cleanDisplayName(EnhanceComponent.displayName)
      NextComponent.displayName = displayName
      window[displayName] = NextComponent

      importTest()
        .then(() => {
          window.mocha.run(failures => {
            setFailures(failures)
          })
        })
        .catch(() => {
          setNotFoundTest(true)
        })
    })
  }, [contexts, importComponent, importTest])

  if (notFoundTest) {
    return <h1>Not found test</h1>
  }

  return (
    <div className={classnames}>
      <div id="mocha" />
    </div>
  )
}

Test.displayName = 'Test'
Test.propTypes = {
  contexts: PropTypes.object,
  importComponent: PropTypes.func,
  importTest: PropTypes.func,
  open: PropTypes.bool
}
export default Test

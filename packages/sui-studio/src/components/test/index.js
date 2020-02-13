import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

import SUIContext from '@s-ui/react-context'
import withContext from '../demo/HoC/withContext'
import {cleanDisplayName} from '../demo/utilities'

const BASE_CLASSNAME = 'sui-Test'
const interOP = obj => (obj.default ? obj.default : obj)

const Test = ({open, importTest, importComponent, context}) => {
  const [failures, setFailures] = useState(0)
  const [notFoundTest, setNotFoundTest] = useState(false)

  const classnames = cx(BASE_CLASSNAME, {
    [`${BASE_CLASSNAME}--open`]: open,
    [`${BASE_CLASSNAME}--failures`]: failures
  })

  useEffect(() => {
    importComponent().then(async module => {
      const Component = module.default || module

      let nextContext = interOP(context)
      nextContext =
        typeof nextContext !== 'function' ? nextContext : await nextContext()

      window.__STUDIO_CONTEXTS__ = nextContext
      window.__STUDIO_COMPONENT__ = Component

      const EnhanceComponent = withContext(nextContext, nextContext)(Component)
      !EnhanceComponent.displayName &&
        console.error('[sui-Test] Component without displayName') // eslint-disable-line
      window[cleanDisplayName(EnhanceComponent.displayName)] = props => (
        <SUIContext.Provider value={nextContext}>
          <EnhanceComponent {...props} />
        </SUIContext.Provider>
      )

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
  }, [context, importComponent, importTest])

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
  context: PropTypes.object,
  importComponent: PropTypes.func,
  importTest: PropTypes.func,
  open: PropTypes.bool
}
export default Test

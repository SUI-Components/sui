import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

import {addSetupEnvironment} from '../../../../src/environment-mocha/setupEnvironment'
import {
  addReactContextToComponent,
  extractDisplayName
} from '../../../../src/components/utils'

addSetupEnvironment(window)

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
      const displayName = extractDisplayName(Component)

      const nextContexts =
        typeof contexts !== 'function' ? contexts : await contexts()

      window.__STUDIO_CONTEXTS__ = nextContexts
      window.__STUDIO_COMPONENT__ = Component

      const {default: context} = nextContexts

      const NextComponent = addReactContextToComponent(Component, {context})
      window[displayName] = NextComponent

      importTest()
        .then(() => window.mocha.run(setFailures))
        .catch(() => setNotFoundTest(true))
    })
  }, [contexts, importComponent, importTest])

  if (notFoundTest) return <h1>No tests found</h1>

  return (
    <div className={classnames}>
      <div id="mocha" />
    </div>
  )
}

Test.propTypes = {
  contexts: PropTypes.object,
  importComponent: PropTypes.func,
  importTest: PropTypes.func,
  open: PropTypes.bool
}
export default Test

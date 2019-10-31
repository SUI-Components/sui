import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

import SUIContext from '@s-ui/react-context'
import withContext from '../demo/HoC/withContext'
import {cleanDisplayName} from '../demo/utilities'

const BASE_CLASSNAME = 'sui-Test'

const Test = ({open, importTest, importComponent, context}) => {
  const classnames = cx(BASE_CLASSNAME, {
    [`${BASE_CLASSNAME}--open`]: open
  })

  useEffect(() => {
    importComponent().then(module => {
      const Component = module.default || module
      const EnhanceComponent = withContext(/* flag */ context, context)(
        Component
      )
      !EnhanceComponent.displayName &&
        console.error('[sui-Test] Component without displayName')
      window[cleanDisplayName(EnhanceComponent.displayName)] = props => (
        <SUIContext.Provider value={context}>
          <EnhanceComponent {...props} />
        </SUIContext.Provider>
      )
      importTest().then(() => {
        window.mocha.run()
      })
    })
  }, [context, importComponent, importTest])

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

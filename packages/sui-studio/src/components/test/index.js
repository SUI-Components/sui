import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

const BASE_CLASSNAME = 'sui-Test'

const Test = ({open}) => {
  const classnames = cx(BASE_CLASSNAME, {
    [`${BASE_CLASSNAME}--open`]: open
  })

  useEffect(() => {
    window.mocha.run()
  }, [])

  return (
    <div className={classnames}>
      <div id="mocha" />
    </div>
  )
}

Test.displayName = 'Test'
Test.propTypes = {
  open: PropTypes.bool
}
export default Test

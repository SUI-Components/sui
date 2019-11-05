import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

const BASE_CLASSNAME = 'sui-Test'

const Test = ({open}) => {
  const [failures, setFailures] = useState(0)
  const classnames = cx(BASE_CLASSNAME, {
    [`${BASE_CLASSNAME}--open`]: open,
    [`${BASE_CLASSNAME}--failures`]: failures
  })

  useEffect(() => {
    window.mocha.run(failures => {
      setFailures(failures)
    })
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

import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import {tryRequireCore as tryRequire, tryRequireTest} from '../tryRequire'

import Test from '../test'

const TestPage = ({params}) => {
  const [requires, setRequires] = useState({loading: true})

  useEffect(() => {
    tryRequire({
      category: params.category,
      component: params.component
    })
      .then(([exports, playground, ctxt = {}]) => {
        setRequires({component: exports, contexts: ctxt, loading: false})
      })
      .catch(err => {
        console.log(err) // eslint-disable-line
      })
  }, [params.category, params.component])

  return (
    <>
      {requires.component && (
        <Test
          open
          importComponent={() => Promise.resolve(requires.component)}
          importTest={() =>
            tryRequireTest({
              component: params.component,
              category: params.category
            })
          }
          contexts={requires?.contexts}
        />
      )}
      {requires.loading && <h1>Loading...</h1>}
    </>
  )
}

TestPage.displayName = 'TestPage'
TestPage.propTypes = {
  params: PropTypes.shape({
    category: PropTypes.string,
    component: PropTypes.string
  })
}
export default TestPage

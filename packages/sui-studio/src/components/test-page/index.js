import React from 'react'
import PropTypes from 'prop-types'

import {tryRequireCore as tryRequire, tryRequireTest} from '../tryRequire'

import When from '../when'
import Test from '../test'

const TestPage = ({params}) => {
  const [requires, setRequires] = React.useState({loading: true})

  React.useEffect(() => {
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
      <When value={requires.component}>
        {() => (
          <Test
            open
            importComponent={() => Promise.resolve(requires.component)}
            importTest={() =>
              tryRequireTest({
                component: params.component,
                category: params.category
              })
            }
            context={requires?.contexts}
          />
        )}
      </When>
      <When value={requires.loading}>{() => <h1>Loading...</h1>}</When>
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

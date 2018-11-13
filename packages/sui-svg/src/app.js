/* global __BASE_DIR__ */

import React from 'react'
import {render} from 'react-dom'
import PropTypes from 'prop-types'
import {Library, Example} from '@compositor/kit'

const ctx = require.context(`${__BASE_DIR__}/lib`, true, /\.*\.js$/)
const FnToReactComponent = ({component: Component}) => <Component />

const App = () => (
  <Library>
    {ctx.keys().map((key, idx) => (
      <Example name={key} key={idx}>
        <FnToReactComponent component={ctx(key).default} />
      </Example>
    ))}
  </Library>
)

render(<App />, document.getElementById('app'))

FnToReactComponent.propTypes = {
  component: PropTypes.func
}

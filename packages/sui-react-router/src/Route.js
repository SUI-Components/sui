import PropTypes from 'prop-types'
import invariant from 'invariant'

import {component, components} from './InternalPropTypes'

const Route = () => {
  invariant(
    false,
    '<Route> elements are for router configuration only and should not be rendered'
  )
}

Route.displayName = 'Route'
Route.propTypes = {
  components,
  component,
  getComponent: PropTypes.func,
  path: PropTypes.string
}

export default Route


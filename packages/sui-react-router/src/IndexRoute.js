// from: https://github.com/ReactTraining/react-router/blob/v3/modules/IndexRoute.js

import PropTypes from 'prop-types'

import invariant from './internal/invariant'
import {falsy} from './internal/PropTypes'

/**
 * An <IndexRoute> is used to specify its parent's <Route indexRoute> in
 * a JSX route config.
 */
const IndexRoute = () =>
  invariant(
    false,
    '<IndexRoute> elements are for router configuration only and should not be rendered'
  )

IndexRoute.displayName = 'IndexRoute'
IndexRoute.propTypes = {
  /**
   * A single component to be rendered when the route matches the URL. It can
   * be rendered by the parent route component with `props.children`.
   **/
  component: PropTypes.elementType,
  /**
   * Same as `component` but asynchronous, useful for code-splitting.
   */
  getComponent: PropTypes.func,
  /**
   * `path` and `children` props are not supported
   */
  children: falsy,
  path: falsy
}

export default IndexRoute

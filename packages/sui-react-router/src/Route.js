import PropTypes from 'prop-types'
import invariant from './internal/invariant'

const Route = () =>
  invariant(
    false,
    '<Route> elements are for router configuration only and should not be rendered'
  )

Route.displayName = 'Route'
Route.propTypes = {
  /**
   * The child elements or routes to be rendered
   **/
  children: PropTypes.node,
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
   * The path used in the URL.
   * It will concat with the parent route's path unless it starts with `/`, making it an absolute path.
   * If left undefined, the router will try to match the child routes.
   */
  path: PropTypes.string
}

export default Route

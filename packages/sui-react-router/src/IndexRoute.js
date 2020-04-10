import PropTypes from 'prop-types'
import invariant from './utils/invariant'

const IndexRoute = () => {
  invariant(
    false,
    '<IndexRoute> elements are for router configuration only and should not be rendered'
  )
}

IndexRoute.displayName = 'IndexRoute'
IndexRoute.propTypes = {
  /**
   * The child elements or routes to be rendered
   **/
  children: PropTypes.object,
  /**
   * A single component to be rendered when the route matches the URL. It can
   * be rendered by the parent route component with `props.children`.
   **/
  component: PropTypes.object,
  /**
   * Same as `component` but asynchronous, useful for code-splitting.
   */
  getComponent: PropTypes.func
}

export default IndexRoute

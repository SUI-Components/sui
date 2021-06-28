import React from 'react'
import invariant from './internal/invariant'
interface RouteProps {
  /**
   * A single component to be rendered when the route matches the URL. It can
   * be rendered by the parent route component with `props.children`.
   **/
  component: React.ElementType
  /** The child elements or routes to be rendered */
  /**
   * Same as `component` but asynchronous, useful for code-splitting.
   */
  getComponent: (any) => any
  /**
   * The path used in the URL.
   * It will concat with the parent route's path unless it starts with `/`, making it an absolute path.
   * If left undefined, the router will try to match the child routes.
   */
  path: string
}

const Route: React.FC<RouteProps> = () =>
  invariant(
    false,
    '<Route> elements are for router configuration only and should not be rendered'
  )

Route.displayName = 'Route'

export default Route

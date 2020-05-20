// from: https://github.com/ReactTraining/react-router/blob/v3/modules/match.js

import {REPLACE} from 'history/lib/Actions'
import {fromReactTreeToJSON} from './internal/ReactUtils'
import {createTransitionManager} from './internal/createTransitionManager'
import {createRouterHistory, createRouterObject} from './internal/RouterUtils'

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser unless you're using
 * server-side rendering with async routes.
 * @param {{ history?: object, location, routes: import('react').ComponentType }} options
 * @param {Function} callback Function to be execute after match
 */
export default async (
  {history: externalHistory, location, routes},
  callback
) => {
  try {
    const history = externalHistory || createRouterHistory(location)
    const jsonRoutes = fromReactTreeToJSON(routes)
    const transitionManager = createTransitionManager({history, jsonRoutes})
    const {
      components,
      redirectLocation,
      routeInfo
    } = await transitionManager.match(location)

    // if it's not a redirection and we don't have components
    // then we should response with nothing
    if (!redirectLocation && (!components || !components.length)) callback()

    const {isActive} = transitionManager
    const router = createRouterObject(history, isActive, routeInfo)
    const renderProps = {
      components,
      router,
      matchContext: {transitionManager, router},
      ...routeInfo
    }

    return callback(
      null,
      redirectLocation && history.createLocation(redirectLocation, REPLACE),
      renderProps
    )
  } catch (err) {
    callback(err)
  }
}

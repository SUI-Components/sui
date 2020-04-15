// from: https://github.com/ReactTraining/react-router/blob/v3/modules/match.js

import {REPLACE} from 'history/lib/Actions'
import {fromReactTreeToJSON} from './utils/react-utils'
import {createTransitionManager} from './createTransitionManager'
import {createRouterObject} from './utils/RouterUtils'
import createMemoryHistory from './createMemoryHistory'

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser unless you're using
 * server-side rendering with async routes.
 * @param {{ routes: Array, history?: object, location }} options
 * @param {Function} callback Function to be execute after match
 */
export default async (
  {routes, history = createMemoryHistory(), location},
  callback
) => {
  const jsonRoutes = fromReactTreeToJSON(routes)
  const transitionManager = createTransitionManager({
    history,
    jsonRoutes
  })

  const {
    components,
    redirectLocation,
    routeInfo
  } = await transitionManager.match(location)

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
}

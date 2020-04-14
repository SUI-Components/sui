// from: https://github.com/ReactTraining/react-router/blob/v3/modules/match.js

import {REPLACE} from 'history/lib/Actions'
import {fromReactTreeToJSON} from './utils/react-utils'
import {createTransitionManager} from './createTransitionManager'
import {createRouterObject} from './utils/RouterUtils'

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser unless you're using
 * server-side rendering with async routes.
 * @param {{ routes: Array, history, location }} options
 * @param {Function} callback
 */
export default async ({routes, history, location}, callback) => {
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

  // TODO: Maybe I need do something more here.
  // https://github.com/ReactTraining/react-router/blob/v3/modules/RouterUtils.js#L1
  const {isActive} = transitionManager
  const router = createRouterObject(history, isActive, routeInfo)

  return callback(
    null,
    redirectLocation && history.createLocation(redirectLocation, REPLACE),
    {
      components,
      router,
      matchContext: {transitionManager, router},
      ...routeInfo
    }
  )
}

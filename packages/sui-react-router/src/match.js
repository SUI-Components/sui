import {REPLACE} from 'history/lib/Actions'
import {fromReactTreeToJSON} from './utils/react-utils'
import {createTransitionManager} from './createTransitionManager'

const match = async ({routes, history, location}, cb) => {
  const jsonRoutes = fromReactTreeToJSON(routes)
  const transitionManager = createTransitionManager({history, jsonRoutes})

  const match = await transitionManager.match(location)
  const {components, redirectLocation, routeInfo} = match
  // TODO: Maybe I need do something more here.
  // https://github.com/ReactTraining/react-router/blob/v3/modules/RouterUtils.js#L1
  const router = {
    ...history,
    isActive: transitionManager.isActive,
    location: routeInfo?.location,
    params: routeInfo?.params,
    routes: routeInfo?.routes
  }

  return cb(
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

export default match

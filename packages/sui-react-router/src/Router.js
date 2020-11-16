import {createElement as h, useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {routes, components} from './internal/PropTypes'
import {fromReactTreeToJSON} from './internal/ReactUtils'
import {createRouterHistory, createRouterObject} from './internal/RouterUtils'
import {createTransitionManager} from './internal/createTransitionManager'
import RouterContext from './internal/Context'

import Route from './Route'

const renderRouterContent = ({components, params, router}) => {
  const {location, routes} = router
  // get the latest matched route
  const route = routes && routes.length ? routes[routes.length - 1] : []

  const routerInfo = {
    location,
    params,
    routeParams: params,
    route,
    router,
    routes
  }

  return components.reduceRight(
    (children, component) => h(component, routerInfo, children),
    null
  )
}

const createRoutes = ({children, routes}) => {
  if (routes) return fromReactTreeToJSON(routes)
  return fromReactTreeToJSON(h(Route, null, children))
}

const Router = ({
  children,
  components = [],
  history = createRouterHistory(),
  matchContext,
  onError,
  params,
  router: routerFromProps,
  routes
}) => {
  // we might be using Router with match, if it's the case
  // when we should have from props the transitionManager and the router object
  // if not, we are going to create it with the needed info
  const transitionManager =
    matchContext?.transitionManager ??
    createTransitionManager({
      history,
      jsonRoutes: createRoutes({children, routes})
    })

  const router =
    routerFromProps ?? createRouterObject(history, transitionManager.isActive)

  const [state, setState] = useState({router, params, components})

  useEffect(() => {
    let prevState = {}
    const handleTransition = (err, nextState) => {
      if (err) {
        if (onError) return onError(err)
        throw err
      }

      // avoid not needed re-renders of the state if the prevState and the nextState
      // are the same reference
      if (prevState === nextState) return
      prevState = nextState

      const {components, params, location, routes} = nextState
      const nextRouter = {...state.router, params, location, routes}
      setState({router: nextRouter, params, components})
    }

    const unlisten = transitionManager.listen(handleTransition)
    return () => unlisten()
  }, []) // eslint-disable-line

  return (
    <RouterContext.Provider value={state}>
      {renderRouterContent(state)}
    </RouterContext.Provider>
  )
}

Router.displayName = 'Router'

Router.propTypes = {
  children: routes,
  components,
  history: PropTypes.object,
  matchContext: PropTypes.object,
  onError: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
  routes // alias for children
}

export default Router

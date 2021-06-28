import { createElement as h, useState, useEffect } from 'react'

import { fromReactTreeToJSON } from './internal/ReactUtils'
import { createRouterHistory, createRouterObject } from './internal/RouterUtils'
import { createTransitionManager } from './internal/createTransitionManager'
import RouterContext from './internal/Context'

import Route from './Route'
import * as React from 'react'
import { Router as RouterType } from './types.js'

const renderRouterContent = ({ components, params, router }) => {
  const { location, routes } = router
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

const createRoutes = ({ children, routes }) => {
  if (routes) return fromReactTreeToJSON(routes)
  return fromReactTreeToJSON(h(Route, null, children))
}

interface RouterProps {
  children: React.ReactNode
  components: React.ReactNode
  history: History
  matchContext: (...args) => any
  onError?: (...args) => void
  params: object
  router: RouterType
  routes // alias for children
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
}: RouterProps): JSX.Element => {
  // we might be using Router with match, if it's the case
  // when we should have from props the transitionManager and the router object
  // if not, we are going to create it with the needed info
  const transitionManager =
    matchContext?.transitionManager ??
    createTransitionManager({
      history,
      jsonRoutes: createRoutes({ children, routes })
    })

  const router =
    routerFromProps ?? createRouterObject(history, transitionManager.isActive)

  const [state, setState] = useState({ router, params, components })

  useEffect(() => {
    let prevState = {}
    const handleTransition = (err, nextState): void => {
      if (err) {
        if (typeof onError === 'function') {
          onError(err)
          return
        }
        throw err
      }

      // avoid not needed re-renders of the state if the prevState and the nextState
      // are the same reference
      if (prevState === nextState) return
      prevState = nextState

      const { components, params, location, routes } = nextState
      const nextRouter = { ...state.router, params, location, routes }
      setState({ router: nextRouter, params, components })
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

export default Router

import React, {createElement as h, useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {routes, components} from './internal/PropTypes'
import {fromReactTreeToJSON} from './internal/ReactUtils'
import {createRouterHistory, createRouterObject} from './internal/RouterUtils'

import {createTransitionManager} from './internal/createTransitionManager'
import RouterContext from './internal/Context'

const renderRouterContent = ({components, params, router}) =>
  components.reduceRight(
    (acc, component) =>
      h(component, {
        children: acc,
        location: router.location,
        params,
        routeParams: params,
        router,
        routes: router.routes
      }),
    null
  )

const Router = ({
  components,
  history = createRouterHistory(),
  matchContext,
  onError,
  params,
  router: routerFromProps,
  routes
}) => {
  const transitionManager =
    matchContext?.transitionManager ??
    createTransitionManager({history, jsonRoutes: fromReactTreeToJSON(routes)})
  const router =
    routerFromProps ?? createRouterObject(history, transitionManager)

  const [state, setState] = useState({router, params, components})

  useEffect(() => {
    const unlisten = matchContext.transitionManager.listen((err, nextState) => {
      if (err) {
        if (onError) {
          return onError(err)
        }
        throw err
      }

      const {params, components, location} = nextState
      const nextRouter = {
        ...state.router,
        params,
        location,
        routes
      }

      setState({router: nextRouter, params, components})
    })

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
  components,
  history: PropTypes.object,
  matchContext: PropTypes.object,
  onError: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
  routes // alias for children
}

export default Router

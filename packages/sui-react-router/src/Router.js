import React, {useState, useEffect} from 'react'
import {func, object} from 'prop-types'
import {routes, component, components} from './InternalPropTypes'
import {createTransitionManager} from './createTransitionManager'
import {fromReactTreeToJSON} from './utils/react-utils'
import {createRouterObject} from './utils/RouterUtils'

import RRContext from './ReactRouterContext'

const Router = ({
  components,
  children,
  routes,
  render,
  matchContext,
  params,
  history,
  onError,
  ...props
}) => {
  const transitionManager =
    matchContext?.transitionManager ??
    createTransitionManager({history, jsonRoutes: fromReactTreeToJSON(routes)})
  const router =
    props?.router ??
    createRouterObject(history, transitionManager, {
      location: null,
      routes: null,
      params: null
    })

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
    <RRContext.Provider value={{router: state.router, params: state.params}}>
      {render({
        components: state.components,
        params: state.params,
        router: state.router,
        props
      })}
    </RRContext.Provider>
  )
}

Router.displayName = 'Router'

Router.defaultProps = {
  render: ({components, params, router, props}) => {
    const pipeReact = components => base =>
      components.reduceRight((acc, component) => {
        return React.createElement(component, {
          ...props,
          params,
          router,
          children: acc
        })
      }, base)
    const tree = pipeReact(components)(null)
    return tree
  }
}

Router.propTypes = {
  children: routes,
  component,
  components,
  history: object,
  matchContext: object,
  params: object,
  render: func,
  onError: func,
  router: object,
  routes // alias for children
}

export default Router

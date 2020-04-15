import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {routes, components} from './InternalPropTypes'
import {createTransitionManager} from './createTransitionManager'
import {fromReactTreeToJSON} from './utils/react-utils'
import {createRouterObject} from './utils/RouterUtils'

import RRContext from './Context'

const Router = ({
  children,
  components,
  history,
  matchContext,
  onError,
  params,
  render,
  routes,
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
    <RRContext.Provider value={state}>
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
  component: PropTypes.elementType,
  components,
  history: PropTypes.object,
  matchContext: PropTypes.object,
  onError: PropTypes.func,
  params: PropTypes.object,
  render: PropTypes.func,
  router: PropTypes.object,
  routes // alias for children
}

export default Router

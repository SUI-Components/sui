import React from 'react'
import {func, object} from 'prop-types'
import {routes} from './InternalPropTypes'

import RRContext from './ReactRouterContext'

const Router = ({
  components,
  router,
  children,
  routes,
  render,
  matchContext,
  params,
  ...props
}) => {
  return (
    <RRContext.Provider value={{router, params}}>
      {render({components, params, props})}
    </RRContext.Provider>
  )
}

Router.displayName = 'Router'

Router.defaultProps = {
  render: ({components, params, router, props}) => {
    const pipeReact = components => base =>
      components.reduce(
        (acc, component) =>
          React.createElement(component, {
            ...props,
            params,
            router,
            children: acc
          }),
        base
      )
    const tree = pipeReact(components)(React.Fragment)
    return tree
  }
}

Router.propTypes = {
  history: object,
  children: routes,
  routes, // alias for children
  render: func,

  // PRIVATE: For client-side rehydration of server match.
  matchContext: object
}

export default Router

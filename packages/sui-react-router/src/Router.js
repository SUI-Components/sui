import React from 'react'
import {func, object} from 'prop-types'
import {routes, component, components} from './InternalPropTypes'

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
  router: object,
  routes // alias for children
}

export default Router

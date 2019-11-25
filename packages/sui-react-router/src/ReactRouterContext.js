import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

const ReactRouterContext = React.createContext({})

ReactRouterContext.wrapper = (Component, displayName) => {
  const WrappedComponent = props => (
    <ReactRouterContext.Consumer>
      {context => <Component {...context} {...props} />}
    </ReactRouterContext.Consumer>
  )

  WrappedComponent.displayName = Component.displayName || displayName
  return hoistNonReactStatics(WrappedComponent, Component)
}

export default ReactRouterContext

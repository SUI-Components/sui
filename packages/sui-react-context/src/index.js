import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

const SUIContext = React.createContext()

SUIContext.wrapper = (Component, displayName) => {
  const WrappedComponent = props => (
    <SUIContext.Consumer>
      {context => <Component {...context} {...props} />}
    </SUIContext.Consumer>
  )

  WrappedComponent.displayName = Component.displayName || displayName
  return hoistNonReactStatics(WrappedComponent, Component)
}

export default SUIContext

import * as React from 'react'

import hoistNonReactStatics from 'hoist-non-react-statics'

type SUIContextType = React.Context<any>
& {
  wrapper?: (Component: React.ComponentType<any>, displayName: string) => React.ComponentType<any>
}

const SUIContext: SUIContextType = React.createContext({})

SUIContext.wrapper = (Component, displayName): React.ComponentType<any> => {
  const WrappedComponent = (props: any): JSX.Element => (
    <SUIContext.Consumer>
      {context => <Component {...context} {...props} />}
    </SUIContext.Consumer>
  )

  WrappedComponent.displayName = Component.displayName !== undefined
    ? Component.displayName
    : displayName

  return hoistNonReactStatics(WrappedComponent, Component)
}

export default SUIContext

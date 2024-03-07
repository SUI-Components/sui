import * as React from 'react'

import hoistNonReactStatics from 'hoist-non-react-statics'

type SUIContextType = React.Context<any> & {
  wrapper?: (Component: React.ComponentType<any>, displayName: string) => React.ComponentType<any>
}

const SUIContext: SUIContextType = React.createContext({})

SUIContext.wrapper = (Component, displayName): React.ComponentType<any> => {
  const WrappedComponent = (props: any): JSX.Element => (
    <SUIContext.Consumer>{context => <Component {...context} {...props} />}</SUIContext.Consumer>
  )

  WrappedComponent.displayName = Component.displayName ?? displayName

  return hoistNonReactStatics(WrappedComponent, Component)
}

export function useSuiContext(): React.Context<any> {
  return React.useContext(SUIContext)
}

export default SUIContext

import { useRouter } from './hooks'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { Router } from './types.js'
import * as React from 'react'

const getComponentName = (Component: React.ComponentType<any>): string => {
  return Component.displayName !== undefined
    ? Component.displayName
    : Component.name
}
/**
 * HoC to enhance a component to inject the router context
 * @param Component to be enhanced
 * @param options with the displayName to use
 */
export default (Component: React.ComponentType<any>, { displayName }: { displayName: string } = { displayName: '' }): React.ComponentType<any> => {
  const WrappedComponent = (externalProps): JSX.Element => {
    // Extract the router using the hook
    const router: Router = useRouter()
    const { params, location, routes } = router
    const props = { ...externalProps, router, params, location, routes }
    return <Component {...props} />
  }

  WrappedComponent.displayName =
    displayName !== '' ? displayName : `withRouter(${getComponentName(Component)})`

  return hoistNonReactStatics(WrappedComponent, Component)
}

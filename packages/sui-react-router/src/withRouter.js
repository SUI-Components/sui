import React from 'react'
import {useRouter} from './hooks'
import hoistNonReactStatics from 'hoist-non-react-statics'

/**
 * HoC to enhance a component to inject the router context
 * @param {import('react').ComponentType} Component to be enhanced
 * @param {{ displayName: String }=} displayName
 */
export default (Component, {displayName} = {displayName: ''}) => {
  const WrappedComponent = externalProps => {
    const router = useRouter()
    const {params, location, routes} = router
    const props = {...externalProps, router, params, location, routes}
    return <Component {...props} />
  }

  WrappedComponent.displayName =
    displayName || `withRouter(${Component.displayName || Component.name})`
  return hoistNonReactStatics(WrappedComponent, Component)
}

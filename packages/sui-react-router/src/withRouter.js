import React from 'react'
import {useRouter} from './hooks'
import hoistNonReactStatics from 'hoist-non-react-statics'

export default (Component, displayName) => {
  const WrappedComponent = externalProps => {
    const router = useRouter()
    const {params, location, routes} = router
    const props = {...externalProps, router, params, location, routes}
    return <Component {...props} />
  }

  WrappedComponent.displayName = Component.displayName || displayName
  return hoistNonReactStatics(WrappedComponent, Component)
}

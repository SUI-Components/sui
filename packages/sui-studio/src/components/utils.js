/* globals __SUI_STUDIO_CONFIG__ __SUI_STUDIO_COMPONENTS_LIST__ */
import {forwardRef} from 'react'

import hoistNonReactStatics from 'hoist-non-react-statics'

import SUIContext from '@s-ui/react-context'

const DEFAULT_LOGO =
  "<svg viewBox='0 0 470 340.6'> <path fill='#e30613' d='M129.6 170.3c0-58.6 29.6-110.2 74.6-140.8L155.5 1.8c-4.2-2.4-9.3-2.3-13.5.1L6.7 81.2C2.5 83.6 0 88.1 0 92.9v156.9c0 4.8 2.6 9.2 6.8 11.6l137.4 77.5c4.2 2.3 9.4 2.3 13.6-.2l46.7-27.4c-45.2-30.6-74.9-82.3-74.9-141z' /> <path fill='#009fe3' d='M299.8.1c-35.4 0-68.3 10.8-95.6 29.4l87.7 49.8c4.2 2.4 6.8 6.8 6.8 11.6l1.1 156.8c0 4.8-2.5 9.3-6.7 11.7l-88.6 51.9c27.2 18.4 60 29.2 95.3 29.2 94 0 170.2-76.2 170.2-170.2S393.8.1 299.8.1z' /> <path fill='#000411' d='M299.8 247.7l-1.1-156.8c0-4.8-2.6-9.2-6.8-11.6l-87.7-49.8c-45 30.6-74.6 82.3-74.6 140.8 0 58.7 29.7 110.4 74.9 141l88.6-51.9c4.2-2.4 6.7-6.9 6.7-11.7z' /></svg>"

export const getComponentsList = () => {
  return __SUI_STUDIO_COMPONENTS_LIST__
}

export const getSuiStudioConfig = () => {
  return __SUI_STUDIO_CONFIG__
}

export const getStudioName = () => {
  const {name = 'SUI Components'} = getSuiStudioConfig()
  return name
}

export const getStudioLogo = () => {
  const {logo = DEFAULT_LOGO} = getSuiStudioConfig()
  return logo
}

/**
 * Best effort to extract the displayName from a Component
 * @param {React.ComponentType} Component
 * @return {string}
 */
export const extractDisplayName = Component =>
  Component.displayName || (Component.type && Component.type.displayName) || Component.name

/**
 * Add React Context
 * @param {React.ComponentType} Component
 * @param {{context: object}} Options
 * @return
 */
export const addReactContextToComponent = (Component, {context}) => {
  // extract displayName for the Component
  // until React 17, we need a workaround for React.memo exported components
  // https://github.com/facebook/react/issues/18026#issuecomment-675900452
  const displayName = extractDisplayName(Component)
  !displayName && console.error('Component without displayName') // eslint-disable-line

  // use the new React context and the provider to make context available
  const ComponentWithAllContexts = forwardRef((props, ref) => (
    <SUIContext.Provider value={context}>
      <Component {...props} ref={ref} />
    </SUIContext.Provider>
  ))
  // New component does not have any of the static methods of the original component.
  // We need to copy them:
  // https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
  hoistNonReactStatics(ComponentWithAllContexts, Component)

  return ComponentWithAllContexts
}

/**
 * Safely do a dynamic import
 * @param {object} params
 * @param {any=} params.defaultValue to return in case the dynamic import fails
 * @param {boolean=} params.extractDefault extract default from imported module
 * @param {() => Promise<any>} params.importFile function to import dynamically a module
 * @return {Promise<any>}
 */
export const safeImport = async ({defaultValue = false, extractDefault = true, importFile}) => {
  const file = await importFile().catch(() => defaultValue)
  if (typeof file === 'undefined') {
    return Promise.reject(new Error('Error requiring file'))
  }
  return extractDefault && typeof file === 'object' ? file.default : file
}

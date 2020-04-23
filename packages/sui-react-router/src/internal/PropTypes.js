import {object, arrayOf, oneOfType, element, elementType} from 'prop-types'

export function falsy(props, propName, componentName) {
  if (props[propName])
    return new Error(`<${componentName}> should not have a "${propName}" prop`)
}

export const components = oneOfType([elementType, object])
export const route = oneOfType([object, element])
export const routes = oneOfType([route, arrayOf(route)])

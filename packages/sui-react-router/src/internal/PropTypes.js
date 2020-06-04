import {object, arrayOf, oneOfType, element, elementType} from 'prop-types'

/**
 * Detect easily we're using a falsy value as a prop type
 * @param {Object} props are all the props passed to the component
 * @param {String} propName to check
 * @param {String} componentName is the name of the component
 * @return {Error | undefined} Return an Error if the prop value is not falsy
 */
export function falsy(props, propName, componentName) {
  if (props[propName])
    return new Error(`<${componentName}> should not have a "${propName}" prop`)
}

const route = oneOfType([object, element])
export const components = oneOfType([elementType, object])
export const routes = oneOfType([route, arrayOf(route)])

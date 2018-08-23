import deepmerge from 'deepmerge'

export const DEFAULT_CONTEXT = 'default'
const DDD_REACT_REDUX = '@schibstedspain/ddd-react-redux'
const REACT_DOMAIN_CONNECTOR = '@s-ui/react-domain-connector'

export const checkIfPackageHasProvider = pkg =>
  pkg &&
  pkg.dependencies &&
  (pkg.dependencies[DDD_REACT_REDUX] ||
    pkg.dependencies[REACT_DOMAIN_CONNECTOR])

export const createContextByType = (ctxt, type) => {
  // check if the user has created a context.js with the needed contextTypes
  if (typeof ctxt !== 'object' || ctxt === null) {
    console.warn( // eslint-disable-line
      "[Studio] You're trying to use a contextType in your component but it seems that you haven't created a context.js in the playground folder. This will likely make your component won't work as expected or it might have an useless context."
    )
  }
  return deepmerge(ctxt[DEFAULT_CONTEXT], ctxt[type])
}

export const isFunction = fnc =>
  !!(fnc && fnc.constructor && fnc.call && fnc.apply)
export const cleanDisplayName = displayName => {
  const [fallback, name] = displayName.split(/\w+\((\w+)\)/)
  return name !== undefined ? name : fallback
}
export const pipe = (...funcs) => arg =>
  funcs.reduce((value, func) => func(value), arg)

export const removeDefaultContext = exports => {
  const {[DEFAULT_CONTEXT]: toOmit, ...restOfExports} = exports
  return restOfExports
}

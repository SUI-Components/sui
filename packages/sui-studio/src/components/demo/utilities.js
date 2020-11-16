import deepmerge from 'deepmerge'

export const DEFAULT_CONTEXT = 'default'

export const createContextByType = (ctxt, type) => {
  // check if the user has created a context.js with the needed contextTypes
  if (typeof ctxt !== 'object' || ctxt === null) {
    console.warn(
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

export const removeDefaultContext = exports => {
  const {[DEFAULT_CONTEXT]: toOmit, ...restOfExports} = exports
  return restOfExports
}

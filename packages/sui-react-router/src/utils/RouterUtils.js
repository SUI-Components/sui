// from https://github.com/ReactTraining/react-router/blob/v3/modules/RouterUtils.js#L1

/**
 * Create the router object that will be availble in the context with all the needed info
 * @param {Object} history
 * @param {{ isActive: Function }} isActive
 * @param {{ location: String, params, routes }} state
 * @returns { import('../types').Router }
 */
export const createRouterObject = (history, isActive, state) => {
  const {location, params, routes} = state || {}

  return {
    ...history,
    isActive,
    location,
    params,
    routes
  }
}

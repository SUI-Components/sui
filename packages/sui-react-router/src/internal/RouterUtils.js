// from https://github.com/ReactTraining/react-router/blob/v3/modules/RouterUtils.js#L1

import browserHistory from '../browserHistory'
import createMemoryHistory from '../createMemoryHistory'
import canUseDOM from './canUseDOM'

/**
 * Create the history that the router will use depending on the environment
 */
export const createRouterHistory = options =>
  canUseDOM ? browserHistory : createMemoryHistory(options)

/**
 * Create the router object that will be availble in the context with all the needed info
 * @param {Object} history
 * @param {{ isActive: () => Boolean }} isActive
 * @param {{ location: String, params: Object, routes: Array }=} state
 * @returns { import('../types').Router }
 */
export const createRouterObject = (
  history,
  isActive,
  state = {location: null, params: null, routes: null}
) => {
  const {location, params, routes} = state

  return {
    ...history,
    isActive,
    location,
    params,
    routes
  }
}

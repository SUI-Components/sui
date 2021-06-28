// from https://github.com/ReactTraining/react-router/blob/v3/modules/RouterUtils.js#L1

import browserHistory from '../browserHistory'
import createMemoryHistory from '../createMemoryHistory'
import { Router } from '../types.js'
import canUseDOM from './canUseDOM'

/**
 * Create the history that the router will use depending on the environment
 */
export const createRouterHistory = (options?): History =>
  canUseDOM ? browserHistory : createMemoryHistory(options)

/**
 * Create the router object that will be availble in the context with all the needed info
 * @param {object} history
 * @param {(...args) => boolean } isActive
 * @param {{ location: string, params: object, routes: array }=} state
 */
export const createRouterObject = (
  history,
  isActive: (...args) => boolean,
  state = { location: null, params: null, routes: null }
): Router => {
  const { location, params, routes } = state

  return {
    ...history,
    isActive,
    location,
    params,
    routes
  }
}

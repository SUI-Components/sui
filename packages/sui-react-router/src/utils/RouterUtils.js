export const createRouterObject = (history, transitionManager, state) => {
  const router = {
    ...history,
    isActive: transitionManager.isActive
  }

  return assignRouterState(router, state)
}

export const assignRouterState = (router, {location, params, routes} = {}) => {
  return {
    ...router,
    location,
    params,
    routes
  }
}

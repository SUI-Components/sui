export const optimizelyUserId = ({payload, next}) => {
  const {
    obj: {integrations}
  } = payload

  // when integrations.All equals false, destinations are deactivated
  if (integrations.All === false) {
    return next(payload)
  }

  payload.obj.integrations = {
    ...integrations,
    Optimizely: {
      userId: window.analytics.user().anonymousId(),
      ...integrations.Optimizely
    }
  }

  next(payload)
}

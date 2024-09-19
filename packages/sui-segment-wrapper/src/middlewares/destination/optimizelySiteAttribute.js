export const optimizelySiteAttributeMiddleware = ({payload, next}) => {
  const {
    obj: {integrations, context}
  } = payload

  if (!context.site) {
    return next(payload)
  }

  payload.obj.integrations = {
    ...integrations,
    Optimizely: {
      ...integrations.Optimizely,
      attributes: {
        site: context.site,
        ...integrations.Optimizely?.attributes
      }
    }
  }

  next(payload)
}

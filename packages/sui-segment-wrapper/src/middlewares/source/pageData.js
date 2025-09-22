export const createPageDataMiddleware = () => {
  let last = null

  return ({payload, next}) => {
    try {
      const {obj} = payload
      const {event, type} = obj

      if (type !== 'track') {
        next(payload)
        return
      }

      if (typeof event === 'string' && event.endsWith('Viewed')) {
        const {page_name: name, page_type: type} = obj.properties || {}
        last = {name, type}

        next(payload)
        return
      }

      if (!last) {
        next(payload)
        return
      }

      next({
        ...payload,
        obj: {
          ...obj,
          properties: {
            ...obj.properties,
            page_name_origin: last.name,
            page_type: obj.properties?.page_type || last.type
          }
        }
      })
    } catch (error) {
      console.error(error) // eslint-disable-line
      next(payload)
    }
  }
}

export const pageData = createPageDataMiddleware()

export const createPageDataMiddleware = () => {
  let last = null

  return ({payload, next}) => {
    const {obj} = payload
    const {event} = obj

    if (event.endsWith('Viewed')) {
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
  }
}

export const pageData = createPageDataMiddleware()

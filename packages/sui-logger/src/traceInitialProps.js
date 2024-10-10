export const traceInitialProps =
  callback =>
  async ({context, routeInfo, ...others}) => {
    const {logger} = context
    const {routes} = routeInfo
    const route = routes[routes.length - 1]
    const pathname = route?.path || route?.regexp?.toString()
    const params = {context, routeInfo, ...others}

    if (!logger?.trace || !pathname) {
      return callback(params)
    }

    const wrapped = logger.trace('trace', callback, {
      logErrors: true,
      tags: [{key: 'pathname', value: pathname}]
    })

    return wrapped(params)
  }

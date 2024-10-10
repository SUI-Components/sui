import createLogger from './logger'

let createdListener = false
const noop = () => {}

const handleProcessUnhandledErrors = logError => {
  process.on('unhandledRejection', error => {
    throw error
  })

  process.on('uncaughtException', err => {
    logError(err)
    setTimeout(() => {
      process.exit(1)
    }, 2000)
  })
}

const createListenUnhandled = () => {
  if (createdListener) return noop
  createdListener = true
  return handleProcessUnhandledErrors
}

const extractFrom = req => {
  if (!req) return {getUrlFactory: () => ''}

  return {
    userAgent: req.headers['user-agent'],
    getUrlFactory: () => req.url
  }
}

export const logErrorsMiddleware = (error, req, res, next) => {
  const logger = createLogger({
    ...extractFrom(req),
    forwardConsoleErrors: false
  })
  logger.error(error)
  next(error)
}

export const createServerLogger = ({req, userId, trackerName} = {}) => {
  return createLogger({
    ...extractFrom(req),
    listenUnhandled: createListenUnhandled(),
    userId,
    trackerName
  })
}

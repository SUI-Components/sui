import createLogger from './logger'

export const createClientLogger = ({userId, trackerName} = {}) =>
  createLogger({
    listenUnhandled: logError => {
      const handleWindowError = e => {
        const error = e.reason || e.error

        logError(error)
      }

      window.addEventListener('error', handleWindowError)
      window.addEventListener('unhandledrejection', handleWindowError)
    },
    userAgent: window.navigator.userAgent,
    trackerName,
    userId,
    getUrlFactory: () => window.location.href
  })

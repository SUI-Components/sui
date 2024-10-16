import createLogger from './logger'

export const createClientLogger = ({Trackers, userId, trackerName} = {}) =>
  createLogger({
    Trackers,
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

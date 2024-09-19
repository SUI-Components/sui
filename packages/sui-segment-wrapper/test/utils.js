/**
 * Extract easily the properties and context used for the track
 * @return {{properties: object, context: object}}
 */
export const getDataFromCall = call => {
  const [, properties, context] = call.args
  return {properties, context}
}

/**
 * Extract easily the last properties and context used for the track
 * @return {{properties: object, context: object}}
 */
export const getDataFromLastTrack = () => getDataFromCall(window.analytics.track.lastCall)

/**
 * Waits until condition is true, or timeout
 *
 * @param {Function} condition
 * @param {Object} options
 * @param {String} options.message
 * @param {Number} options.timeout
 * @returns
 */
export const waitUntil = (condition = () => false, {message = TIMEOUT_MESSAGE, timeout = DEFAULT_TIMEOUT_MS} = {}) =>
  new Promise((resolve, reject) => {
    const iid = setInterval(() => {
      if (condition()) {
        clearTimeout(tid)
        clearInterval(iid)
        resolve()
      }
    }, 5)
    const tid = setTimeout(() => {
      clearTimeout(tid)
      clearInterval(iid)
      reject(new Error(message))
    }, timeout)
  })

const DEFAULT_TIMEOUT_MS = 50
export const TIMEOUT_MESSAGE = 'wait timeout'

/**
 * @deprecated Adobe Analytics integration has been removed.
 * These functions are kept for backwards compatibility but return empty values.
 * Please remove any imports of these functions from your code.
 */

/**
 * @deprecated Returns empty Adobe visitor data
 * @returns {Promise<{trackingServer: string, version: string}>}
 */
export const getAdobeVisitorData = () => {
  return Promise.resolve({
    trackingServer: '',
    version: ''
  })
}

/**
 * @deprecated Returns empty Marketing Cloud Visitor ID
 * @returns {Promise<string>}
 */
export const getAdobeMCVisitorID = () => {
  return Promise.resolve('')
}

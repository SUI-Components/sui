import {parse} from 'qs'

/**
 * parse query string to object
 *
 * @param {string} query
 * @param {object} [options={}]
 * @param {boolean} [options.ignoreQueryPrefix=true] - avoid the leading question mark
 * @param {boolean} [options.comma] - comma to join array
 */
function parseQueryString(query, options = {}) {
  const {ignoreQueryPrefix = true, comma} = options

  const mergedOptions = {
    ignoreQueryPrefix,
    ...(typeof comma !== 'undefined' && {comma})
  }

  return parse(query, mergedOptions)
}

export default parseQueryString

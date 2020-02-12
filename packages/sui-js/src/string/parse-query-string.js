import {parse} from 'qs'

/**
 * parse query string to object
 *
 * @param {string} query
 * @param {object} [options={}]
 * @param {boolean} [options.ignoreQueryPrefix=true] - avoid the leading question mark
 * @param {boolean} [options.comma] - comma to join array
 * @param {string} [options.delimiter] - delimiter
 */
function parseQueryString(query, options = {}) {
  const {ignoreQueryPrefix = true, comma, delimiter} = options

  const mergedOptions = {
    ignoreQueryPrefix,
    ...(typeof comma !== 'undefined' && {comma}),
    ...(typeof delimiter !== 'undefined' && {delimiter})
  }

  return parse(query, mergedOptions)
}

export default parseQueryString

import {stringify} from 'qs'

/**
 * converts query params object to query string
 *
 * @param {object} queryParams
 * @param {object} [options={}]
 * @param {'indices'|'brackets'|'repeat'|'comma'} [options.arrayFormat] - specify the format of the output array
 * @param {string} [options.delimiter] - delimiter
 * @param {boolean} [options.encode=true] - encode
 * @param {boolean} [options.addQueryPrefix=false] - add question mark query prefix
 * @param {boolean} [options.skipNulls=false] - skip null values
 */
function toQueryString(queryParams, options = {}) {
  const {addQueryPrefix = false, arrayFormat, delimiter, encode = true, skipNulls = false } = options

  const mergedOptions = {
    addQueryPrefix,
    encode,
    skipNulls,
    ...(typeof arrayFormat !== 'undefined' && {arrayFormat}),
    ...(typeof delimiter !== 'undefined' && {delimiter})
  }

  return stringify(queryParams, mergedOptions)
}

export default toQueryString

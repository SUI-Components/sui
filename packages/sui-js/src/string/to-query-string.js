import {stringify} from 'qs'

/**
 * converts query params object to query string
 *
 * @param {object} queryParams
 * @param {object} [options={}]
 * @param {'indices'|'brackets'|'repeat'|'comma'} [options.arrayFormat] - specify the format of the output array
 */
function toQueryString(queryParams, options = {}) {
  const {arrayFormat, delimiter} = options

  const mergedOptions = {
    ...(typeof arrayFormat !== 'undefined' && {arrayFormat}),
    ...(typeof delimiter !== 'undefined' && {delimiter})
  }

  return stringify(queryParams, mergedOptions)
}

export default toQueryString

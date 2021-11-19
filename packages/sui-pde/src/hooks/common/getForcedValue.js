import {parseQueryString} from '@s-ui/js/lib/string'
export const serverGetForcedValue = ({key, queryString}) => {
  if (!queryString) {
    return
  }

  const queryParams = parseQueryString(queryString)
  return queryParams[`suipde_${key}`]
}
/**
 * @param {object} param
 * @param {string} key Experiment or feature flag key
 * @param {string} queryString Test purposes only
 * @returns {string|null}
 */

export const clientGetForcedValue = ({
  key,
  queryString = document.location.search
}) => {
  const queryParams = parseQueryString(queryString)
  return queryParams[`suipde_${key}`]
}

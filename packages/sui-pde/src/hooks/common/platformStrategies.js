import {parseQueryString} from '@s-ui/js/lib/string'
import {trackedEventsLocalCache} from '../../utils/trackedEventsLocalCache'

const getServerStrategy = () => ({
  getVariation: ({pde, experimentName, attributes}) => {
    return pde.getVariation({pde, name: experimentName, attributes})
  },
  trackExperiment: () => {},
  getForcedValue: ({key, queryString}) => {
    if (!queryString) {
      return
    }

    const queryParams = parseQueryString(queryString)
    return queryParams[`suipde_${key}`]
  }
})

const getBrowserStrategy = ({cache}) => ({
  getVariation: ({pde, experimentName, attributes}) => {
    const variationName = pde.activateExperiment({
      name: experimentName,
      attributes
    })

    return variationName
  },
  /**
   * @param {object} param
   * @param {string} key Experiment or feature flag key
   * @param {string} queryString Test purposes only
   * @returns {string|null}
   */
  getForcedValue: ({key, queryString = document.location.search}) => {
    const queryParams = parseQueryString(queryString)
    return queryParams[`suipde_${key}`]
  }
})

/**
 * Returns the implementation of experiment related methods depending on
 * which platform we are server/browser
 * @param {object} param
 * @returns object
 */
export const getPlatformStrategy = () => {
  const isNode = typeof window === 'undefined'

  if (isNode) {
    return getServerStrategy()
  }
  trackedEventsLocalCache.init()
  return getBrowserStrategy({
    cache: trackedEventsLocalCache
  })
}

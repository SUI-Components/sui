import {parseQueryString} from '@s-ui/js/lib/string/index.js'

import {trackedEventsLocalCache} from './trackedEventsLocalCache.js'

const getServerStrategy = () => ({
  getVariation: ({pde, experimentName, attributes, adapterId}) => {
    return pde.getVariation({pde, name: experimentName, attributes, adapterId})
  },
  decide: ({pde, name, attributes, adapterId}) => {
    return pde.decide({pde, name, attributes, adapterId})
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

const getBrowserStrategy = ({customTrackExperimentViewed, cache}) => ({
  getVariation: ({pde, experimentName, attributes, adapterId}) => {
    const variationName = pde.activateExperiment({
      name: experimentName,
      attributes,
      adapterId
    })

    return variationName
  },
  decide: ({pde, name, attributes, adapterId}) => {
    return pde.decide({pde, name, attributes, adapterId})
  },
  trackExperiment: ({variationName, experimentName}) => {
    if (customTrackExperimentViewed) {
      return customTrackExperimentViewed({variationName, experimentName})
    }

    // user is not part of the experiment
    if (!variationName) return

    // if experiment has been already tracked
    if (cache.includes(experimentName, variationName)) return

    if (!window.analytics?.track) {
      // eslint-disable-next-line no-console
      console.error("[sui-pde: useExperiment] window.analytics.track expected to exists but doesn't")
      return
    }

    cache.push(experimentName, variationName)

    window.analytics.ready(() => {
      window.analytics.track('Experiment Viewed', {
        experimentName,
        variationName
      })
    })
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
 * @param {function} [param.customTrackExperimentViewed]
 * @returns object
 */
export const getPlatformStrategy = ({customTrackExperimentViewed} = {}) => {
  const isNode = typeof window === 'undefined'

  if (isNode) {
    return getServerStrategy()
  }
  trackedEventsLocalCache.init()
  return getBrowserStrategy({
    customTrackExperimentViewed,
    cache: trackedEventsLocalCache
  })
}

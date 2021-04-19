import {parseQueryString} from '@s-ui/js/lib/string'

const getServerStrategy = () => ({
  getVariation: ({pde, experimentName, attributes}) => {
    return pde.getVariation({pde, name: experimentName, attributes})
  },
  trackExperiment: () => {},
  getForcedValue: () => {}
})

const getBrowserStrategy = ({customTrackExperimentViewed}) => ({
  getVariation: ({pde, experimentName, attributes}) => {
    const variationName = pde.activateExperiment({
      name: experimentName,
      attributes
    })

    return variationName
  },
  trackExperiment: ({variationName, experimentName}) => {
    if (customTrackExperimentViewed) {
      return customTrackExperimentViewed({variationName, experimentName})
    }

    // user is not part of the experiment
    if (!variationName) return
    if (!window.analytics?.track) {
      // eslint-disable-next-line no-console
      console.error(
        "[sui-pde: useExperiment] window.analytics.track expected to exists but doesn't"
      )
      return
    }

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

  return getBrowserStrategy({customTrackExperimentViewed})
}

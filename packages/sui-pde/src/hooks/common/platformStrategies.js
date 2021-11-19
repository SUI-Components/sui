import {trackedEventsLocalCache} from './trackedEventsLocalCache'
import {serverGetVariation, clientGetVariation} from './getVariation'
import {serverTrackExperiment, clientTrackExperiment} from './trackExperiment'
import {serverGetForcedValue, clientGetForcedValue} from './getForcedValue'

const getServerStrategy = () => ({
  getVariation: serverGetVariation,
  trackExperiment: serverTrackExperiment,
  getForcedValue: serverGetForcedValue
})

const getBrowserStrategy = ({customTrackExperimentViewed, cache}) => ({
  getVariation: clientGetVariation,
  trackExperiment: clientTrackExperiment({customTrackExperimentViewed, cache}),

  getForcedValue: clientGetForcedValue
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

import {useContext, useMemo} from 'react'
import PdeContext from '../contexts/PdeContext'
import {getPlatformStrategy} from './platformStrategies'

/**
 * Hook to use a experiment
 * @param {object} param
 * @param {string} param.experimentName
 * @param {object} param.attributes
 * @param {function} param.trackExperimentViewed
 * @return {{variation: string}}
 */
export default function useExperiment({
  experimentName,
  attributes,
  trackExperimentViewed,
  queryString // for test purposes only
} = {}) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error(
      '[sui-pde: useExperiment] sui-pde provider is required to work'
    )

  const variation = useMemo(() => {
    let variationName
    const strategy = getPlatformStrategy({
      customTrackExperimentViewed: trackExperimentViewed
    })

    try {
      const forcedVariation = strategy.getForcedVariation({
        key: experimentName,
        queryString
      })
      if (forcedVariation) {
        return forcedVariation
      }
      variationName = strategy.getVariation({pde, experimentName, attributes})
      strategy.trackExperiment({variationName, experimentName})
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return null
    }

    return variationName
  }, [trackExperimentViewed, experimentName, queryString, pde, attributes])

  return {variation}
}

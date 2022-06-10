import {useContext, useMemo} from 'react'
import PdeContext from '../contexts/PdeContext.js'
import {getPlatformStrategy} from './common/platformStrategies.js'

/**
 * Hook to use a experiment
 * @param {object} param
 * @param {string} param.experimentName
 * @param {object} param.attributes
 * @param {function} param.trackExperimentViewed
 * @param {string} param.queryString
 * @param {string} param.adapterId Adapter id to be executed
 * @return {{variation: string}}
 */
export default function useExperiment({
  experimentName,
  attributes,
  trackExperimentViewed,
  queryString,
  adapterId
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
      const forcedVariation = strategy.getForcedValue({
        key: experimentName,
        queryString
      })
      if (forcedVariation) {
        return forcedVariation
      }

      variationName = strategy.getVariation({
        pde,
        experimentName,
        attributes,
        adapterId
      })
      strategy.trackExperiment({variationName, experimentName})
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return null
    }

    return variationName
  }, [
    trackExperimentViewed,
    experimentName,
    queryString,
    pde,
    attributes,
    adapterId
  ])

  return {variation}
}

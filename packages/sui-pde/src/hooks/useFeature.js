import {useContext} from 'react'
import PdeContext from '../contexts/PdeContext'
import {getPlatformStrategy} from './common/platformStrategies'

/**
 * Hook to use a feature toggle
 * @param {string} featureKey
 * @param {object} attributes
 * @param {string} [queryString] test purposes only
 * @return {{isActive: boolean}}
 */
export default function useFeature(featureKey, attributes, queryString) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error('[useFeature] sui-pde provider is required to work')

  const strategy = getPlatformStrategy()

  const forcedValue = strategy.getForcedValue({
    key: featureKey,
    queryString
  })

  try {
    if (forcedValue) {
      return {isActive: forcedValue === 'on', linkedExperiments: []}
    }

    const {isActive, linkedExperiments} = pde.isFeatureEnabled({
      featureKey,
      attributes
    })

    const variables = pde.getAllFeatureVariables({
      featureKey,
      attributes
    })

    trackFeatureFlagViewed({
      isActive,
      trackExperimentViewed: strategy.trackExperiment,
      featureKey
    })
    trackLinkedExperimentsViewed({
      linkedExperiments,
      trackExperimentViewed: strategy.trackExperiment,
      pde,
      attributes
    })
    return {isActive, variables}
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return {isActive: false, variables: {}}
  }
}

import {useContext} from 'react'
import PdeContext from '../contexts/PdeContext'
import {getPlatformStrategy} from './common/platformStrategies'

const VARIATION_NAME_ON = 'On State'
const VARIATION_NAME_OFF = 'Off State'

/**
 * track feature flag's own Experiment Viewed event
 * @param {object} param
 * @param {boolean} param.isActive
 * @param {function} param.trackExperimentViewed
 * @param {string} param.featureKey
 */
const trackFeatureFlagViewed = ({
  isActive,
  trackExperimentViewed,
  featureKey
}) => {
  const variationName = isActive ? VARIATION_NAME_ON : VARIATION_NAME_OFF
  trackExperimentViewed({experimentName: featureKey, variationName})
}

/**
 * track every linked experiment's Experiment Viewed event
 * @param {object} param
 * @param {linkedExperiments} string[] feature tests using the current feature flag
 * @param {function} trackExperimentViewed
 * @param {object} attributes user attributes to take into account for its segmentation
 * @param {object} pde
 */
const trackLinkedExperimentsViewed = ({
  linkedExperiments,
  trackExperimentViewed,
  attributes,
  pde
}) => {
  if (!linkedExperiments) return
  linkedExperiments.forEach(experimentName => {
    const variationName = pde.getVariation({
      experimentName,
      pde,
      attributes
    })
    trackExperimentViewed({variationName, experimentName})
  })
}

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

const VARIATION_NAME_ON = 'On State'
const VARIATION_NAME_OFF = 'Off State'

/**
 * track feature flag's own Experiment Viewed event
 * @param {object} param
 * @param {boolean} param.isActive
 * @param {string} param.featureKey
 * @return {experimentName, variationName}
 */
export const normalizeFeatureFlag = ({isActive, featureKey}) => {
  const variationName = isActive ? VARIATION_NAME_ON : VARIATION_NAME_OFF
  return {experimentName: featureKey, variationName}
}

/**
 * track every linked experiment's Experiment Viewed event
 * @param {object} param
 * @param {linkedExperiments} string[] feature tests using the current feature flag
 * @param {function} trackExperimentViewed
 * @param {object} attributes user attributes to take into account for its segmentation
 * @param {object} pde
 */
export const trackLinkedExperimentsViewed = ({
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

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

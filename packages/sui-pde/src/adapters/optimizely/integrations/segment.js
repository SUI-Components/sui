/**
 * From https://segment.com/docs/connections/destinations/catalog/optimizely-web/#optimizely-full-stack-javascript-sdk
 * The instance must be named optmizelyClientInstance.
 * Attach the optimizelyClientInstance to the window so Segment recognizes it.
 * @param {object} param
 * @param {object} param.activeIntegrations  check if your integration key is set to true in order to know
 *                                           if your integration should be activated
 *                                           Example {segment: true, braze: true}
 * @param {object} param.optimizelyInstance
 */
export const segment = ({
  activeIntegrations,
  optimizelyInstance,
  hasUserConsents
}) => {
  if (!activeIntegrations.segment || typeof window === 'undefined') return
  if (!hasUserConsents) {
    delete window.optimizelyClientInstance
    return
  }
  if (!window.optimizelyClientInstance) {
    window.optimizelyClientInstance = optimizelyInstance
  }
}

const VARIATION_NAME_ON = 'On State'
const VARIATION_NAME_OFF = 'Off State'
const TRACK_EVENT_NAME = 'Experiment Viewed'

const getFeatureTrackData = ({decisionInfo} = {}) => {
  const {featureKey, featureEnabled} = decisionInfo

  return {
    experimentName: featureKey,
    variationName: featureEnabled ? VARIATION_NAME_ON : VARIATION_NAME_OFF
  }
}
const getFeatureTestTrackData = ({decisionInfo} = {}) => {
  const {sourceInfo = {}} = decisionInfo
  const {experimentKey, variationKey} = sourceInfo
  return {
    experimentName: experimentKey,
    variationName: variationKey
  }
}
const getExperimentTrackData = ({decisionInfo} = {}) => {
  const {experimentKey, variationKey} = decisionInfo
  return {
    experimentName: experimentKey,
    variationName: variationKey
  }
}

/**
 * Based on Optimizely documentation:
 * https://docs.developers.optimizely.com/full-stack/docs/set-up-segment
 */
export function handleSegmentDecision(decision) {
  const {type, decisionInfo} = decision
  const {source} = decisionInfo

  const isFeature = type === 'feature'
  const isFeatureTest = isFeature && source === 'feature-test'

  const featureTrackingDataMapper = isFeatureTest
    ? getFeatureTestTrackData
    : getFeatureTrackData

  const trackingDataMapper = isFeature
    ? featureTrackingDataMapper
    : getExperimentTrackData

  console.log({
    decision,
    event: TRACK_EVENT_NAME,
    data: trackingDataMapper(decision)
  })

  window.analytics.ready(() => {
    window.analytics.track(TRACK_EVENT_NAME, trackingDataMapper(decision))
  })
}

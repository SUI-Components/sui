import {trackedEventsLocalCache as cache} from '../../../utils/trackedEventsLocalCache'
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

const getFeatureTrackData = ({decisionInfo} = {}) => {
  const {featureKey, featureEnabled} = decisionInfo

  return {
    experimentName: featureKey,
    variationName: featureEnabled ? 'On State' : 'Off State'
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

const trackExperiment = ({experimentName, variationName}) => {
  // user is not part of the experiment
  if (!variationName) return

  // if experiment has been already tracked
  if (cache.includes(experimentName, variationName)) return

  if (!window.analytics?.track) {
    // eslint-disable-next-line no-console
    console.error(
      "[sui-pde: useExperiment] window.analytics.track expected to exists but doesn't"
    )
    return
  }

  cache.push(experimentName, variationName)

  window.analytics.ready(() => {
    window.analytics.track('Experiment Viewed', {
      experimentName,
      variationName
    })
  })
}

/**
 * Based on Optimizely documentation:
 * https://docs.developers.optimizely.com/full-stack/docs/set-up-segment
 */
export function handleSegmentNotificationListener(decision) {
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

  const trackingData = trackingDataMapper(decision)

  console.log({
    decision
  })

  trackExperiment(trackingData)
}

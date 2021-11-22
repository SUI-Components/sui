import {track} from '../../tracking'

export const trackingListener = ({customTrackExperimentViewed}) => {
  return ({type, userId, attributes, decisionInfo}) => {
    console.log(userId, attributes, type, decisionInfo)
    if (type === 'feature') {
      track({
        featureKey: decisionInfo.featureKey,
        isActive: decisionInfo.featureEnabled
      })
    } else if (type === 'ab-test') {
      track({
        experimentKey: decisionInfo.experimentKey,
        variationKey: decisionInfo.variationKey
      })
    }
  }
}

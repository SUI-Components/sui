import {getPlatformStrategy} from './platformStrategies.js'

/**
 * Function to call decide
 * @param {object} pde
 * @return {function}
 */
export default function getDecision(pde) {
  if (pde === null) {
    throw new Error('[sui-pde: useDecision] sui-pde provider is required to work')
  }

  const decide = (name, {attributes, trackExperimentViewed, isEventDisabled, queryString, adapterId} = {}) => {
    try {
      const strategy = getPlatformStrategy({
        customTrackExperimentViewed: trackExperimentViewed
      })

      const forced = strategy.getForcedValue({
        key: name,
        queryString
      })

      if (forced) {
        if (['on', 'off'].includes(forced)) {
          return {enabled: forced === 'on', flagKey: name}
        }

        return {enabled: true, flagKey: name, variationKey: forced}
      }

      const notificationId = pde.addDecideListener({
        onDecide: ({type, decisionInfo: decision}) => {
          const {ruleKey, variationKey, decisionEventDispatched} = decision

          if (type === 'flag' && decisionEventDispatched) {
            strategy.trackExperiment({variationName: variationKey, experimentName: ruleKey})
          }
        }
      })

      const data = strategy.decide({
        pde,
        name,
        attributes,
        adapterId,
        isEventDisabled
      })

      pde.removeNotificationListener({notificationId})

      return data
    } catch (error) {
      return {enabled: false, flagKey: name}
    }
  }

  return {decide}
}

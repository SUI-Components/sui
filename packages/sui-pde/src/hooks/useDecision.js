import {useContext, useMemo} from 'react'

import PdeContext from '../contexts/PdeContext.js'
import {getPlatformStrategy} from './common/platformStrategies.js'

/**
 * Hook to use a feature test
 * @param {string} name
 * @param {object} param
 * @param {object} param.attributes
 * @param {function} param.trackExperimentViewed
 * @param {string} param.queryString
 * @param {string} param.adapterId Adapter id to be executed
 * @return {object}
 */
export default function useDecision(name, {attributes, trackExperimentViewed, queryString, adapterId} = {}) {
  const {pde} = useContext(PdeContext)

  if (pde === null) {
    throw new Error('[sui-pde: useDecision] sui-pde provider is required to work')
  }

  const data = useMemo(() => {
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
        adapterId
      })

      pde.removeNotificationListener({notificationId})

      return data
    } catch (error) {
      return {enabled: false, flagKey: name}
    }
  }, [trackExperimentViewed, name, queryString, pde, attributes, adapterId])

  return data
}

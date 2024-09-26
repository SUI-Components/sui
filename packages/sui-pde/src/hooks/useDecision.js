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

  const variation = useMemo(() => {
    const strategy = getPlatformStrategy({
      customTrackExperimentViewed: trackExperimentViewed
    })

    const forced = strategy.getForcedValue({
      key: name,
      queryString
    })

    const data = strategy.decide({
      pde,
      name,
      attributes,
      adapterId
    })

    const {ruleKey, variationKey} = data || {}

    if (forced) {
      if (!ruleKey) {
        return {...data, enabled: forced === 'on'}
      }

      return {...data, enabled: true, variationKey: forced}
    }

    if (ruleKey) {
      strategy.trackExperiment({variationName: variationKey, experimentName: name})
    }

    return data
  }, [trackExperimentViewed, name, queryString, pde, attributes, adapterId])

  return {variation}
}

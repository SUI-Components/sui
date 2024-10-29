import {useMemo} from 'react'

import useDecisionCallback from './useDecisionCallback.js'

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
export default function useDecision(
  name,
  {attributes, trackExperimentViewed, isEventDisabled, queryString, adapterId} = {}
) {
  const decide = useDecisionCallback()

  const data = useMemo(() => {
    return decide(name, attributes, trackExperimentViewed, isEventDisabled, queryString, adapterId)
  }, [name, attributes, trackExperimentViewed, isEventDisabled, queryString, adapterId])

  return data
}

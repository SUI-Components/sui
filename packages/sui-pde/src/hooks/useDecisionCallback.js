import {useCallback, useContext} from 'react'

import PdeContext from '../contexts/PdeContext.js'
import getDecision from '../getDecision.js'

/**
 * Hook to call decide
 * @return {function}
 */
export default function useDecisionCallback() {
  const {pde} = useContext(PdeContext)

  const getDecisionCallback = useCallback(getDecision, [])

  return getDecisionCallback(pde)
}

import {useContext, useMemo} from 'react'
import PdeContext from '../contexts/PdeContext'

/**
 * Hook to use a experiment
 * @param {string} experimentName
 * @return {{variation: string}}
 */
export default function useExperiment(experimentName) {
  const {pde} = useContext(PdeContext)
  if (pde === null) throw new Error('[useExperiment] pde is required to work')
  const variation = useMemo(
    () => pde.activateExperiment({name: experimentName}),
    [experimentName, pde]
  )

  return {variation}
}

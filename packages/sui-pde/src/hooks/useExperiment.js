import {useContext, useMemo} from 'react'
import PdeContext from '../contexts/PdeContext'

/**
 * Hook to use a experiment
 * @param {string} experimentName
 * @param {object} options
 * @return {{variation: string}}
 */
export default function useExperiment(experimentName, options) {
  const {pde} = useContext(PdeContext)
  if (pde === null) throw new Error('[useExperiment] pde is required to work')
  const variation = useMemo(
    () => pde.activateExperiment({name: experimentName, options}),
    [experimentName, pde, options]
  )

  return {variation}
}

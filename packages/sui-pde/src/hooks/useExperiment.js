import {useContext, useMemo} from 'react'
import PdeContext from '../contexts/PdeContext'

/**
 * Hook to use a experiment
 * @param {string} experimentName
 * @param {object} attributes
 * @return {{variation: string}}
 */
export default function useExperiment(experimentName, attributes) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error('[useExperiment] sui-pde provider is required to work')

  const variation = useMemo(
    () => pde.activateExperiment({name: experimentName, attributes}),
    [experimentName, pde, attributes]
  )

  return {variation}
}

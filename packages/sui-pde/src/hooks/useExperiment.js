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

  const variation = useMemo(() => {
    let variationName

    try {
      variationName = pde.activateExperiment({name: experimentName, attributes})

      if (
        variationName &&
        typeof window !== 'undefined' &&
        window.analytics?.track
      ) {
        window.analytics.track('Experiment Viewed', {
          experimentName,
          variationName
        })
      } else {
        console.error(
          "[useExperiment] sui-pde: window.analytics.track expected to exists but doesn't"
        )
      }
    } catch (error) {
      console.error(error)
      return null
    }

    return variationName
  }, [experimentName, pde, attributes])

  return {variation}
}

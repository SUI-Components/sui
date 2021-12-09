import {useContext, useMemo} from 'react'
import PdeContext from '../contexts/PdeContext'
import {getPlatformStrategy} from './common/platformStrategies'

/**
 * Hook to use a experiment
 * @param {object} param
 * @param {string} param.experimentName
 * @param {object} param.attributes
 * @param {string} [param.queryString] Test purposes only
 * @return {{variation: string}}
 */
export default function useExperiment({
  experimentName,
  attributes,
  queryString // for test purposes only
} = {}) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error(
      '[sui-pde: useExperiment] sui-pde provider is required to work'
    )

  const variation = useMemo(() => {
    let variationName
    const strategy = getPlatformStrategy()

    try {
      const forcedVariation = strategy.getForcedValue({
        key: experimentName,
        queryString
      })
      if (forcedVariation) {
        return forcedVariation
      }
      variationName = strategy.getVariation({pde, experimentName, attributes})
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return null
    }

    return variationName
  }, [experimentName, queryString, pde, attributes])

  return {variation}
}

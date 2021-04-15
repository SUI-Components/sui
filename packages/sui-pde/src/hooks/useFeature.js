import {useContext} from 'react'
import PdeContext from '../contexts/PdeContext'
import {getPlatformStrategy} from './platformStrategies'

/**
 * Hook to use a feature toggle
 * @param {object} params
 * @param {string} params.featureKey
 * @param {object} params.attributes
 * @param {string} params.queryString test purposes only
 * @return {{isActive: boolean}}
 */
export default function useFeature({featureKey, attributes, queryString}) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error('[useExperiment] sui-pde provider is required to work')

  const strategy = getPlatformStrategy()

  const forcedValue = strategy.getForcedValue({
    key: featureKey,
    queryString
  })

  if (forcedValue) {
    return {isActive: forcedValue}
  }

  const features = pde.getEnabledFeatures({attributes})
  const isActive = features.some(f => f === featureKey)
  return {isActive}
}

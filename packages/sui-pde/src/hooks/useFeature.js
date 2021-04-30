import {useContext} from 'react'
import PdeContext from '../contexts/PdeContext'
import {getPlatformStrategy} from './platformStrategies'

/**
 * Hook to use a feature toggle
 * @param {string} featureKey
 * @param {object} attributes
 * @param {string} [queryString] test purposes only
 * @return {{isActive: boolean}}
 */
export default function useFeature(featureKey, attributes, queryString) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error('[useFeature] sui-pde provider is required to work')

  const strategy = getPlatformStrategy()

  const forcedValue = strategy.getForcedValue({
    key: featureKey,
    queryString
  })

  if (forcedValue) {
    return {isActive: forcedValue === 'on'}
  }

  let isActive
  try {
    isActive = pde.isFeatureEnabled({featureKey, attributes})
  } catch (error) {
    console.error(error)
    isActive = false
  }
  return {isActive}
}

import {useContext} from 'react'
import PdeContext from '../contexts/PdeContext'

/**
 * Hook to use a feature toggle
 * @param {string} featureKey
 * @param {object} attributes
 * @return {{isActive: boolean}}
 */
export default function useFeature(featureKey, attributes) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error('[useExperiment] sui-pde provider is required to work')

  const features = pde.getEnabledFeatures({attributes})
  const isActive = features.some(f => f === featureKey)
  return {isActive}
}

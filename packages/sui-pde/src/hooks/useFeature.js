import {useContext} from 'react'
import FeatureContext from '../contexts/FeatureContext'

/**
 * Hook to use a feature toggle
 * @param {string} featureKey
 * @param {object} options
 * @return {{isActive: boolean}}
 */
export default function useFeature(featureKey, options = {}) {
  const {features = []} = useContext(FeatureContext)
  console.log('useFeature', featureKey, features)

  const isActive = features.some(f => f === featureKey)
  return {isActive}
}

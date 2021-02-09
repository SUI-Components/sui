import {useContext} from 'react'
import PdeContext from '../contexts/PdeContext'

/**
 * Hook to use a feature toggle
 * @param {string} featureKey
 * @param {object} options
 * @return {{isActive: boolean}}
 */
export default function useFeature(featureKey, options = {}) {
  const {features = []} = useContext(PdeContext)

  const isActive = features.some(f => f === featureKey)
  return {isActive}
}

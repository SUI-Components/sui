import {useContext} from 'react'
import FeatureContext from '../contexts/FeatureContext'

/**
 * Hook to use a feature toggle
 * @param {{featureKey: string}} params
 * @return {{isActive: boolean}}
 */
export default function useFeature({featureKey}) {
  const {features = []} = useContext(FeatureContext)

  const isActive = features.some(f => f === featureKey)
  return {isActive}
}

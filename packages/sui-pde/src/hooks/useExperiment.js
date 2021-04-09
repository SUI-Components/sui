import {useContext, useMemo} from 'react'
import PdeContext from '../contexts/PdeContext'

const isNode = typeof window === 'undefined'

const serverStrategy = {
  getVariation: ({pde, experimentName, attributes}) => {
    return pde.getVariation({pde, name: experimentName, attributes})
  },
  trackExperiment: () => {}
}

const browserStrategy = {
  getVariation: ({pde, experimentName, attributes}) => {
    const variationName = pde.activateExperiment({
      name: experimentName,
      attributes
    })

    return variationName
  },
  trackExperiment: ({variationName, experimentName}) => {
    // user is not part of the experiment
    if (!variationName) return
    if (!window.analytics?.track) {
      // eslint-disable-next-line no-console
      console.error(
        "[sui-pde: useExperiment] window.analytics.track expected to exists but doesn't"
      )
      return
    }

    window.analytics.ready(() => {
      window.analytics.track('Experiment Viewed', {
        experimentName,
        variationName
      })
    })
  }
}

/**
 * Hook to use a experiment
 * @param {object} param
 * @param {string} param.experimentName
 * @param {object} param.attributes
 * @param {function} param.trackExperimentViewed
 * @return {{variation: string}}
 */
export default function useExperiment({
  experimentName,
  attributes,
  trackExperimentViewed
} = {}) {
  const {pde} = useContext(PdeContext)
  if (pde === null)
    throw new Error(
      '[sui-pde: useExperiment] sui-pde provider is required to work'
    )

  const variation = useMemo(() => {
    let variationName
    const clientStrategy = {
      ...browserStrategy,
      ...(trackExperimentViewed && {
        trackExperiment: trackExperimentViewed
      })
    }
    const strategy = isNode ? serverStrategy : clientStrategy

    try {
      variationName = strategy.getVariation({pde, experimentName, attributes})
      strategy.trackExperiment({variationName, experimentName})
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return null
    }

    return variationName
  }, [experimentName, pde, attributes, trackExperimentViewed])

  return {variation}
}

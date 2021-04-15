const getServerStrategy = () => ({
  getVariation: ({pde, experimentName, attributes}) => {
    return pde.getVariation({pde, name: experimentName, attributes})
  },
  trackExperiment: () => {}
})

const getBrowserStrategy = ({customTrackExperimentViewed}) => ({
  getVariation: ({pde, experimentName, attributes}) => {
    const variationName = pde.activateExperiment({
      name: experimentName,
      attributes
    })

    return variationName
  },
  trackExperiment: ({variationName, experimentName}) => {
    if (customTrackExperimentViewed) {
      return customTrackExperimentViewed({variationName, experimentName})
    }

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
})

export const getPlatformStrategy = ({customTrackExperimentViewed}) => {
  const isNode = typeof window === 'undefined'
  if (isNode) {
    return getServerStrategy()
  }

  return getBrowserStrategy({customTrackExperimentViewed})
}

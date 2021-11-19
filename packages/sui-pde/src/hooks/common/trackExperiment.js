export const serverTrackExperiment = () => {}

export const clientTrackExperiment = ({customTrackExperimentViewed, cache}) => {
  return ({variationName, experimentName}) => {
    if (customTrackExperimentViewed) {
      return customTrackExperimentViewed({variationName, experimentName})
    }

    // user is not part of the experiment
    if (!variationName) return

    // if experiment has been already tracked
    if (cache.includes(experimentName, variationName)) return

    if (!window.analytics?.track) {
      // eslint-disable-next-line no-console
      console.error(
        "[sui-pde: useExperiment] window.analytics.track expected to exists but doesn't"
      )
      return
    }

    cache.push(experimentName, variationName)

    window.analytics.ready(() => {
      window.analytics.track('Experiment Viewed', {
        experimentName,
        variationName
      })
    })
  }
}

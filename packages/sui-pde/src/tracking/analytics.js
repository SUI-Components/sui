export const analyticsTrackingFn = ({experimentName, variationName}) => {
  const args = [
    'Experiment Viewed',
    {
      experimentName,
      variationName
    }
  ]

  if (!window.analytics) return
  window.analytics.ready(() => {
    window.analytics.track(...args)
  })
}

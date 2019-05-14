export default {
  identify: (...args) => {
    window.analytics.identify(...args)
  },
  reset: (...args) => {
    window.analytics.reset(...args)
  },
  track: (...args) => {
    window.analytics.track(...args)
  }
}

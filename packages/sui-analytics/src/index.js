export default {
  identify: (...args) => {
    window.analytics.identify(...args)
  },
  reset: (...args) => {
    window.analytics.reset(...args)
  },
  track: (...args) => {
    window.analytics.ready(function() {
      const [event, properties, options = {}, fn] = args
      options.traits = {
        anonymousId: window.analytics.user().anonymousId(),
        userId: window.analytics.user().id()
      }
      window.analytics.track(event, properties, options, fn)
    })
  }
}

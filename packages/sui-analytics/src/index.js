export default {
  ready: function() {
    return new Promise(resolve => {
      window.analytics.ready(function() {
        resolve({
          track: window.analytics.track,
          page: window.analytics.page,
          identify: window.analytics.identify,
          reset: window.analytics.reset
        })
      })
    })
  }
}

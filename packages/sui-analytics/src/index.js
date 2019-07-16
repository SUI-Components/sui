let adobeOrgId

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
      if (window && window.Visitor && adobeOrgId) {
        options['Adobe Analytics'] = {
          marketingCloudVisitorId: window.Visitor.getInstance(
            adobeOrgId
          ).getMarketingCloudVisitorID()
        }
      }
      window.analytics.track(event, properties, options, fn)
    })
  },
  setAdobeOrganizationId: id => {
    adobeOrgId = id
  }
}

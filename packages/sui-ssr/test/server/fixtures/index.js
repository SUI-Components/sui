export const getMockedRequest = hostname => ({
  get: () => {},
  url: '/',
  hostname,
  protocol: 'http'
})

export const ssrConfig = {
  criticalCss: {
    protocol: 'https',
    host: 'www.bikes.com'
  }
}

export const ssrMultiSiteConfig = {
  criticalCss: {
    protocol: 'https',
    host: {
      bikes: 'www.bikes.com',
      trucks: 'www.trucks.com'
    }
  },
  multiSite: {
    'www.bikes.com': 'bikes',
    'www.trucks.com': 'trucks',
    'dev.trucks.com': 'trucks',
    default: 'bikes'
  }
}

export const getMockedRequest = hostname => ({
  get: () => {},
  url: '/',
  hostname,
  protocol: 'http'
})

export const multiSiteMapping = {
  'www.bikes.com': 'bikes',
  'www.trucks.com': 'trucks',
  'dev.trucks.com': 'trucks',
  default: 'bikes'
}

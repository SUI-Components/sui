import bowser from 'bowser'

export const LEGITIMATE_CRAWLER_USER_AGENTS = [
  'googlebot',
  'google-structured-data-testing-tool',
  'bingbot',
  'linkedinbot',
  'mediapartners-google',
  'debugbear'
]

export const stats = userAgent => {
  const ua = bowser.parse(userAgent)
  return {
    isMobile: ua.platform.type === bowser.PLATFORMS_MAP.mobile,
    osName: ua.os.name,
    browserName: ua.browser.name,
    browserVersion: ua.browser.version,
    isTablet: ua.platform.type === bowser.PLATFORMS_MAP.tablet
  }
}

export const checkLegitimateCrawler = (userAgent, crawlerUserAgents) => {
  const lowerCaseUserAgent = userAgent.toLowerCase()

  const crawlerUserAgentsList = crawlerUserAgents || LEGITIMATE_CRAWLER_USER_AGENTS

  return crawlerUserAgentsList.some(ua => lowerCaseUserAgent.includes(ua))
}

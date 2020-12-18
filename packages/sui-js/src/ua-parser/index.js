import bowser from 'bowser'

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

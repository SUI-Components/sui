import bowser, {PLATFORMS_MAP} from 'bowser'

export const stats = userAgent => {
  const ua = bowser.parse(userAgent)

  return {
    isMobile: ua.platform.type === PLATFORMS_MAP.mobile,
    osName: ua.os.name,
    browserName: ua.browser.name,
    browserVersion: ua.browser.version,
    isTablet: ua.platform.type === PLATFORMS_MAP.tablet
  }
}

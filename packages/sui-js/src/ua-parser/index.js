import bowser from 'bowser'

export const stats = userAgent => {
  const ua = bowser._detect(userAgent)

  return {
    isMobile: Boolean(ua.mobile),
    osName: ua.osname,
    browserName: ua.name,
    browserVersion: ua.version,
    isTablet: Boolean(ua.tablet)
  }
}

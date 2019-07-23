import bowser from 'bowser'

export const stats = userAgent => {
  const ua = bowser._detect(userAgent)
  return {
    isMobile: !!ua.mobile,
    osName: ua.osname,
    bowser: ua.browser
  }
}

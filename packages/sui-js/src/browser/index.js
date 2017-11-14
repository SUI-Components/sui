import bowser from 'bowser'

const browser = (userAgent) => {
  const ua = bowser._detect(userAgent)
  return {
    isMobile: !!ua.mobile,
    osName: ua.osname
  }
}

export default browser

import Bowser from 'bowser'

export const uaParser = userAgent => {
  const parser = Bowser.getParser(userAgent)

  const parse = () => Bowser.parse(userAgent)

  const stats = () => ({
    isMobile: parser.is('mobile'),
    osName: parser.getOSName(),
    browserName: parser.getBrowserName(),
    browserVersion: parser.getBrowserVersion()
  })

  const satisfies = checkTree => parser.satisfies(checkTree)

  return {
    parse,
    satisfies,
    stats
  }
}

export const stats = userAgent => uaParser(userAgent).stats()

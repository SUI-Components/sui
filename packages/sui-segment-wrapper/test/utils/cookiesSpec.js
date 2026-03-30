import {expect} from 'chai'

import {getGA4SessionIdFromCookie} from '../../src/utils/cookies.js'

describe('Cookies Utils', () => {
  describe('getGA4SessionIdFromCookie', () => {
    let originalCookie

    beforeEach(() => {
      originalCookie = document.cookie
      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=')
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
      })
    })

    afterEach(() => {
      // Restore original cookies (best effort)
      document.cookie = originalCookie
    })

    it('should return null when GA4 cookie does not exist', () => {
      const sessionId = getGA4SessionIdFromCookie('segment')
      expect(sessionId).to.be.null
    })

    it('should extract session ID from GA4 cookie with default prefix', () => {
      // Simulate GA4 cookie: segment_ga_CONTAINERID=GS1.1.1234567890.1.0.1234567890.0.0.0
      document.cookie = 'segment_ga_G123456=GS1.1.s1234567890.1.0.1234567890.0.0.0'

      const sessionId = getGA4SessionIdFromCookie('segment')
      expect(sessionId).to.equal('1234567890')
    })

    it('should extract session ID from GA4 cookie with custom prefix', () => {
      document.cookie = 'custom_ga_G123456=GS1.1.s9876543210.1.0.1234567890.0.0.0'

      const sessionId = getGA4SessionIdFromCookie('custom')
      expect(sessionId).to.equal('9876543210')
    })

    it('should extract session ID from GA4 cookie with no prefix', () => {
      document.cookie = '_ga_G123456=GS1.1.s5555555555.1.0.1234567890.0.0.0'

      const sessionId = getGA4SessionIdFromCookie('')
      expect(sessionId).to.equal('5555555555')
    })

    it('should return null when cookie format is invalid', () => {
      document.cookie = 'segment_ga_G123456=invalid_format'

      const sessionId = getGA4SessionIdFromCookie('segment')
      expect(sessionId).to.be.null
    })

    it('should return null when cookie has no session marker', () => {
      document.cookie = 'segment_ga_G123456=GS1.1.1234567890.1.0.1234567890.0.0.0'

      const sessionId = getGA4SessionIdFromCookie('segment')
      expect(sessionId).to.be.null
    })

    it('should handle multiple cookies and find the right one', () => {
      document.cookie = 'other_cookie=value123'
      document.cookie = 'segment_ga_G123456=GS1.1.s7777777777.1.0.1234567890.0.0.0'
      document.cookie = 'another_cookie=value456'

      const sessionId = getGA4SessionIdFromCookie('segment')
      expect(sessionId).to.equal('7777777777')
    })
  })
})

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

    it('should work with production cookie format using $ separator', () => {
      // Real production format: GS2.1.s<sessionId>$o1$g0$t<timestamp>$j60$l0$h0
      document.cookie = 'segment_ga_6NE7MBSF9K=GS2.1.s1774864422$o1$g0$t1774864422$j60$l0$h0'

      const sessionId = getGA4SessionIdFromCookie('segment')
      expect(sessionId).to.equal('1774864422')
    })

    it('should find specific cookie when measurementId is provided', () => {
      // Set up multiple GA4 cookies (simulating multiple domains/containers)
      document.cookie = 'segment_ga_6NE7MBSF9K=GS2.1.s1111111111$o1$g0$t1774864422$j60$l0$h0'
      document.cookie = 'segment_ga_L1KP423S8T=GS2.1.s2222222222$o1$g0$t1774864422$j60$l0$h0'
      document.cookie = 'segment_ga_YL86FK3DFK=GS2.1.s3333333333$o1$g0$t1774864422$j60$l0$h0'

      // Should find the specific container's session ID
      const sessionId = getGA4SessionIdFromCookie('segment', 'G-L1KP423S8T')
      expect(sessionId).to.equal('2222222222')
    })

    it('should return null if specific measurementId cookie does not exist', () => {
      document.cookie = 'segment_ga_6NE7MBSF9K=GS2.1.s1111111111$o1$g0$t1774864422$j60$l0$h0'

      const sessionId = getGA4SessionIdFromCookie('segment', 'G-NONEXISTENT')
      expect(sessionId).to.be.null
    })

    it('should handle measurementId without G- prefix', () => {
      document.cookie = 'segment_ga_6NE7MBSF9K=GS2.1.s1111111111$o1$g0$t1774864422$j60$l0$h0'

      // Should work even if G- prefix is already removed
      const sessionId = getGA4SessionIdFromCookie('segment', 'G-6NE7MBSF9K')
      expect(sessionId).to.equal('1111111111')
    })
  })
})

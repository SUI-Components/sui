/* eslint-env mocha */
import {expect} from 'chai'
import cookie, {cookieWithoutEncoding} from '../src/cookie/index'

const TEST_URL = 'https://tools.ietf.org/#%'
const ENCODED_TEST_URL = 'https://tools.ietf.org/#%25'

describe('@s-ui/js', () => {
  describe('cookie', () => {
    beforeEach(() => {
      cookie.set('url', TEST_URL)
    })

    afterEach(() => {
      cookie.remove('url')
    })

    it('should retrieve the actual url set from the cookie', () => {
      const cookieUrl = cookie.get('url')
      expect(cookieUrl).to.be.equal(TEST_URL)
    })

    it('should check cookie includes an encoded url', () => {
      const cookie = window.document.cookie
      expect(cookie).to.include(ENCODED_TEST_URL)
    })
  })

  describe('cookieWithoutEncoding', () => {
    beforeEach(() => {
      cookieWithoutEncoding.set('url', TEST_URL)
    })

    afterEach(() => {
      cookieWithoutEncoding.remove('url')
    })

    it('should retrieve the actual url set from the cookie', () => {
      const cookieUrl = cookieWithoutEncoding.get('url')
      expect(cookieUrl).to.be.equal(TEST_URL)
    })

    it("should check cookie doesn't include an encoded url", () => {
      const cookie = window.document.cookie
      expect(cookie).to.not.include(ENCODED_TEST_URL)
    })
  })
})

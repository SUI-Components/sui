import cookie from '@s-ui/js/lib/cookie'
import {expect} from 'chai'
import getAnonymousUser from '../src/anonymousUser'

describe('#anonymousUser', () => {
  const FAKE_ANONYMOUS_KEY = 'fake_anonymous_id_key'
  const FAKE_ANONYMOUS_COOKIE_ID_VALUE = 'fake_anonymous_cookie_id_value'
  const FAKE_ANONYMOUS_LOCAL_STORAGE_ID_VALUE =
    'fake_anonymous_local_storage_id_value'

  function eraseCookie(key) {
    document.cookie = `${key}=; Max-Age=0`
  }

  function eraseLocalStorage(key) {
    window.localStorage.removeItem(key)
  }

  beforeEach(() => {
    eraseCookie(FAKE_ANONYMOUS_KEY)
    eraseLocalStorage(FAKE_ANONYMOUS_KEY)
  })

  describe('when anonymous id is saved in a cookie', () => {
    beforeEach(() => {
      cookie.set(FAKE_ANONYMOUS_KEY, FAKE_ANONYMOUS_COOKIE_ID_VALUE)
    })

    it('should return the id saved in the cookie', () => {
      const userId = getAnonymousUser(FAKE_ANONYMOUS_KEY)
      expect(userId).to.equal(FAKE_ANONYMOUS_COOKIE_ID_VALUE)
    })
  })

  describe('when no anonymous id is saved in a cookie', () => {
    describe('when anonymous id is saved in local storage', () => {
      beforeEach(() => {
        window.localStorage.setItem(
          FAKE_ANONYMOUS_KEY,
          FAKE_ANONYMOUS_LOCAL_STORAGE_ID_VALUE
        )
      })

      it('should recover the user id set in the local storage', () => {
        const userId = getAnonymousUser(FAKE_ANONYMOUS_KEY)
        expect(userId).to.equal(FAKE_ANONYMOUS_LOCAL_STORAGE_ID_VALUE)
      })

      it('should set the cookie', () => {
        getAnonymousUser(FAKE_ANONYMOUS_KEY)
        expect(cookie.get(FAKE_ANONYMOUS_KEY)).to.equal(
          FAKE_ANONYMOUS_LOCAL_STORAGE_ID_VALUE
        )
      })
    })

    describe('when no anonymous id is saved in local storage', () => {
      let userId

      beforeEach(() => {
        userId = getAnonymousUser(FAKE_ANONYMOUS_KEY)
      })

      it('should execute generate a new uuid', () => {
        expect(userId).to.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )
        expect(userId).to.not.be.undefined
      })

      it('should save it in a cookie', () => {
        expect(cookie.get(FAKE_ANONYMOUS_KEY)).to.equal(userId)
      })

      it('should save it in local storage', () => {
        expect(window.localStorage.getItem(FAKE_ANONYMOUS_KEY)).to.equal(userId)
      })
    })
  })
})

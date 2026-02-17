import {expect} from 'chai'

import {getConfig, setConfig} from '../src/config.js'
import {getUniversalId, getUserDataAndNotify} from '../src/universalId.js'
import {cleanStubs} from './stubs.js'

const UNIVERSAL_ID_EXAMPLE = '043d36c36dad0741bdebce605d0ee4e6c1dea6e2eb6399864dec7a59432a20c4'
const USER_EMAIL_EXAMPLE = 'test@sui.com'
const USER_DATA_READY_EVENT = 'USER_DATA_READY'

describe('Universal Id', () => {
  describe('when universalId config is set', () => {
    beforeEach(() => {
      setConfig('universalId', UNIVERSAL_ID_EXAMPLE)
    })

    afterEach(() => {
      cleanStubs()
    })

    it('could be retrieved as expected from getUniversalId', () => {
      const universalId = getUniversalId()
      expect(universalId).to.equal(UNIVERSAL_ID_EXAMPLE)
    })
  })

  describe('when universalId config is NOT set but userEmail is set', () => {
    beforeEach(() => {
      setConfig('userEmail', USER_EMAIL_EXAMPLE)
    })

    afterEach(() => {
      cleanStubs()
    })

    it('could be retrieved as expected from method getUniversalId and set to window', () => {
      const universalId = getUniversalId()
      expect(universalId).to.equal(UNIVERSAL_ID_EXAMPLE)

      expect(window.__mpi.segmentWrapper.universalId).to.equal(UNIVERSAL_ID_EXAMPLE)
    })

    it('send an event with universalId and userEmail when getUserDataAndNotify is used', () => {
      document.addEventListener(USER_DATA_READY_EVENT, e => {
        expect(e.detail.universalId).to.equal(UNIVERSAL_ID_EXAMPLE)
        expect(e.detail.userEmail).to.equal(USER_EMAIL_EXAMPLE)
      })

      const {universalId, userEmail} = getUserDataAndNotify()
      expect(universalId).to.equal(UNIVERSAL_ID_EXAMPLE)
      expect(userEmail).to.equal(USER_EMAIL_EXAMPLE)

      expect(window.__mpi.segmentWrapper.universalId).to.equal(UNIVERSAL_ID_EXAMPLE)
    })
  })

  describe('when universalId config is NOT set NEITHER userEmail', () => {
    beforeEach(() => {
      setConfig('userEmail', '')
    })

    afterEach(() => {
      cleanStubs()
    })

    it('should set universalIdInitialized config accordingly', () => {
      const universalId = getUniversalId()

      expect(universalId).to.equal(undefined)
      expect(getConfig('universalIdInitialized')).to.be.true
    })
  })
})

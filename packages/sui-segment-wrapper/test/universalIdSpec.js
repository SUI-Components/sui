import {expect} from 'chai'

import {getConfig, setConfig} from '../src/config.js'
import {getUniversalId, getUserDataAndNotify} from '../src/universalId.js'
import {cleanWindowStubs} from './stubs.js'

const UNIVERSAL_ID_EXAMPLE = '7ab9ddf3281d5d5458a29e8b3ae2864335087f1272d41ba440bee23d6acb911b'
const USER_EMAIL_EXAMPLE = 'miduga@gmail.com'
const USER_DATA_READY_EVENT = 'USER_DATA_READY'

describe('Universal Id', () => {
  describe('when universalId config is set', () => {
    beforeEach(() => {
      setConfig('universalId', UNIVERSAL_ID_EXAMPLE)
    })

    afterEach(() => {
      cleanWindowStubs()
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
      cleanWindowStubs()
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
      cleanWindowStubs()
    })

    it('should set universalIdInitialized config accordingly', () => {
      const universalId = getUniversalId()

      expect(universalId).to.equal(undefined)
      expect(getConfig('universalIdInitialized')).to.be.true
    })
  })
})

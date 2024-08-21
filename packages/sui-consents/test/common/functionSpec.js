/* eslint-env mocha */
import {expect} from 'chai'

import {hasUserConsents} from '../../lib/index.js'

describe('hasUserConsents', () => {
  describe('when the user accepts all consents', () => {
    const acceptedConsentsCookie =
      'borosTcf=eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxNiwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjp0cnVlLCIyIjp0cnVlLCIzIjp0cnVlLCI0Ijp0cnVlLCI1Ijp0cnVlLCI2Ijp0cnVlLCI3Ijp0cnVlLCI4Ijp0cnVlLCI5Ijp0cnVlLCIxMCI6dHJ1ZX19LCJzcGVjaWFsRmVhdHVyZXMiOnsiMSI6dHJ1ZX19;'
    it('should return that the user did give the required consents', () => {
      expect(
        hasUserConsents({
          requiredConsents: [1, 2, 3],
          cookies: acceptedConsentsCookie
        })
      ).to.equal(true)
    })
  })

  describe('when the user rejects all consents', () => {
    it('returns that the user hasnt given the required consents', () => {
      const rejectedConsentsCookie =
        'borosTcf=eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxNiwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZSwiOCI6ZmFsc2UsIjkiOmZhbHNlLCIxMCI6ZmFsc2V9fSwic3BlY2lhbEZlYXR1cmVzIjp7IjEiOnRydWV9fQ==;'

      expect(
        hasUserConsents({
          requiredConsents: [1, 2, 3],
          cookies: rejectedConsentsCookie
        })
      ).to.equal(false)
    })
  })

  describe('when some consents are given by the user', () => {
    const consentOneAndThreeAcceptedCookie =
      'borosTcf=eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxNiwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjp0cnVlLCIyIjpmYWxzZSwiMyI6dHJ1ZSwiNCI6ZmFsc2UsIjUiOmZhbHNlLCI2IjpmYWxzZSwiNyI6ZmFsc2UsIjgiOmZhbHNlLCI5IjpmYWxzZSwiMTAiOmZhbHNlfX0sInNwZWNpYWxGZWF0dXJlcyI6eyIxIjp0cnVlfX0=;'
    describe('and the required consents are accepted', () => {
      it('should return that the user did give the required consents', () => {
        expect(
          hasUserConsents({
            requiredConsents: [1, 3],
            cookies: consentOneAndThreeAcceptedCookie
          })
        ).to.equal(true)

        expect(
          hasUserConsents({
            requiredConsents: [1],
            cookies: consentOneAndThreeAcceptedCookie
          })
        ).to.equal(true)
      })
    })

    describe('but the required consents are not accepted', () => {
      it('should return that the user did give the required consents', () => {
        expect(
          hasUserConsents({
            requiredConsents: [2],
            cookies: consentOneAndThreeAcceptedCookie
          })
        ).to.equal(false)
      })
    })
  })
})

import suiAnalytics from '../src/'
import {expect} from 'chai'
import sinon from 'sinon'

describe('#suiAnalytics', () => {
  describe('when the track event is called', () => {
    beforeEach(() => {
      window.analytics = {}
      window.analytics = {
        ready: function(cb) {
          cb()
        },
        user: function() {
          return {
            anonymousId: function() {
              return 'fakeAnonymousId'
            }
          }
        },
        track: sinon.stub()
      }
    })

    afterEach(() => {
      delete window.analytics
    })

    it('should add anonymousId as options trait', () => {
      suiAnalytics.track('fakeEvent', {fakePropKey: 'fakePropValue'})

      sinon.assert.callCount(window.analytics.track, 1)
      expect(window.analytics.track.getCall(0).args[2]).to.deep.equal({
        traits: {anonymousId: 'fakeAnonymousId'}
      })
    })
  })
})

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
        user: () => ({
          anonymousId: () => 'fakeAnonymousId',
          id: () => 'fakeId'
        }),
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
        traits: {anonymousId: 'fakeAnonymousId', userId: 'fakeId'}
      })
    })

    describe('when adobe visitor is set', () => {
      beforeEach(() => {
        window.Visitor = {}
        window.Visitor.getInstance = sinon.stub().returns({
          getMarketingCloudVisitorID: sinon.stub().returns('fakeCloudId')
        })
      })

      afterEach(() => {
        delete window.Visitor
      })

      describe('when organization id has been set', () => {
        beforeEach(() => {
          suiAnalytics.setAdobeOrganizationId('fakeOrgId')
        })

        it('should add the right adobe integration', () => {
          suiAnalytics.track('fakeEvent', {fakePropKey: 'fakePropValue'})

          sinon.assert.callCount(window.analytics.track, 1)
          expect(window.analytics.track.getCall(0).args[2]).to.deep.equal({
            traits: {
              anonymousId: 'fakeAnonymousId',
              userId: 'fakeId'
            },
            'Adobe Analytics': {
              marketingCloudVisitorId: 'fakeCloudId'
            }
          })

          expect(window.Visitor.getInstance.getCall(0).args[0]).to.equal(
            'fakeOrgId'
          )
        })
      })
    })
  })
})

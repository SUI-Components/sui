import {expect} from 'chai'
import sinon from 'sinon'

import {optimizelySiteAttributeMiddleware} from '../../src/middlewares/destination/optimizelySiteAttribute.js'
import {optimizelyUserId as optimizelyUserIdMiddleware} from '../../src/middlewares/source/optimizelyUserId.js'

describe('optimizely middlewares integration', () => {
  beforeEach(() => {
    window.analytics = {}
    window.analytics.user = () => ({
      anonymousId: () => 'anonymousId'
    })
  })

  describe('when no attribute param has been send through', () => {
    let initialPayload, finalPayload
    beforeEach(() => {
      initialPayload = {
        obj: {
          context: {
            site: 'fakesite.fake'
          },
          integrations: {}
        }
      }

      finalPayload = {
        obj: {
          context: {
            site: 'fakesite.fake'
          },
          integrations: {
            Optimizely: {
              userId: 'anonymousId',
              attributes: {
                site: 'fakesite.fake'
              }
            }
          }
        }
      }
    })

    afterEach(() => {
      initialPayload = {}
      finalPayload = {}
    })

    it('should add the userId and attributes to the optimizely integration', () => {
      const nextSpy = sinon.spy()

      optimizelyUserIdMiddleware({payload: initialPayload, next: nextSpy})
      optimizelySiteAttributeMiddleware({
        payload: nextSpy.getCall(0).args[0],
        next: nextSpy
      })
      expect(nextSpy.getCall(1).args[0]).to.deep.equal(finalPayload)
    })

    it('should work even if changing the middleware execution order', () => {
      const nextSpy = sinon.spy()

      optimizelySiteAttributeMiddleware({
        payload: initialPayload,
        next: nextSpy
      })
      optimizelyUserIdMiddleware({
        payload: nextSpy.getCall(0).args[0],
        next: nextSpy
      })
      expect(nextSpy.getCall(1).args[0]).to.deep.equal(finalPayload)
    })
  })

  describe('when attribute param has been send through', () => {
    let initialPayload, finalPayload
    beforeEach(() => {
      initialPayload = {
        obj: {
          context: {
            site: 'fakesite.fake'
          },
          integrations: {
            Optimizely: {
              attributes: {
                myAttribute: 'attributeValue'
              }
            }
          }
        }
      }

      finalPayload = {
        obj: {
          context: {
            site: 'fakesite.fake'
          },
          integrations: {
            Optimizely: {
              attributes: {
                site: 'fakesite.fake',
                myAttribute: 'attributeValue'
              },
              userId: 'anonymousId'
            }
          }
        }
      }
    })

    afterEach(() => {
      initialPayload = {}
      finalPayload = {}
    })

    it('should add the userId and attributes to the optimizely integration', () => {
      const nextSpy = sinon.spy()

      optimizelyUserIdMiddleware({payload: initialPayload, next: nextSpy})
      optimizelySiteAttributeMiddleware({
        payload: nextSpy.getCall(0).args[0],
        next: nextSpy
      })
      expect(nextSpy.getCall(1).args[0]).to.deep.equal(finalPayload)
    })

    it('should work even if changing the middleware execution order', () => {
      const nextSpy = sinon.spy()

      optimizelySiteAttributeMiddleware({
        payload: initialPayload,
        next: nextSpy
      })
      optimizelyUserIdMiddleware({
        payload: nextSpy.getCall(0).args[0],
        next: nextSpy
      })
      expect(nextSpy.getCall(1).args[0]).to.deep.equal(finalPayload)
    })
  })
})

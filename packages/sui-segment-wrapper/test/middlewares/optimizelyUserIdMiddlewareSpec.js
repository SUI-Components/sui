import {expect} from 'chai'
import sinon from 'sinon'

import {optimizelyUserId} from '../../src/middlewares/source/optimizelyUserId'

describe('#optimizelyUserIdMiddleware', () => {
  const fakePayloadFactory = () => ({
    obj: {
      properties: {},
      integrations: {}
    }
  })

  beforeEach(() => {
    window.analytics = {
      user: () => ({
        anonymousId: () => 'anonymousId'
      })
    }
  })

  afterEach(() => {
    window.analytics = null
    delete window.analytics
  })

  it('should add the userId integration', () => {
    const payload = fakePayloadFactory()

    const spy = sinon.spy()
    optimizelyUserId({payload, next: spy})
    expect(spy.args[0][0].obj.integrations.Optimizely.userId).to.equal('anonymousId')
  })

  it('when user hasnt given its consents it shouldnt add the optimizely integration', () => {
    const payload = {
      ...fakePayloadFactory(),
      obj: {
        integrations: {
          All: false
        }
      }
    }
    const spy = sinon.spy()
    optimizelyUserId({payload, next: spy})
    expect(spy.args[0][0].obj.integrations.Optimizely).to.be.undefined
  })
})

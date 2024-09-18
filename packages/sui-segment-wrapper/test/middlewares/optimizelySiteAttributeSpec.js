import {expect} from 'chai'
import sinon from 'sinon'

import {optimizelySiteAttributeMiddleware} from '../../src/middlewares/destination/optimizelySiteAttribute'

describe('#optimizelySiteAttributeMiddleware', () => {
  it('should add optimizelys site attribute from segments context', () => {
    const payload = {
      obj: {
        context: {
          site: 'fakesite.fake'
        },
        integrations: {
          Optimizely: {
            userId: 'fakeUserId'
          }
        }
      }
    }

    const spy = sinon.spy()
    optimizelySiteAttributeMiddleware({payload, next: spy})
    expect(spy.args[0][0].obj.integrations.Optimizely).to.deep.equal({
      userId: 'fakeUserId',
      attributes: {site: 'fakesite.fake'}
    })
  })

  it('when no site context is there it should not add anything', () => {
    const payload = {
      obj: {
        context: {},
        integrations: {
          Optimizely: {
            userId: 'fakeUserId'
          }
        }
      }
    }

    const spy = sinon.spy()
    optimizelySiteAttributeMiddleware({payload, next: spy})
    expect(spy.args[0][0].obj.integrations.Optimizely).to.deep.equal({
      userId: 'fakeUserId'
    })
  })
})

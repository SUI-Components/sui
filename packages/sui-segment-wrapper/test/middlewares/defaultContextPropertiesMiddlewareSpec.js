import {expect} from 'chai'
import sinon from 'sinon'

import {setConfig} from '../../src/config.js'
import {defaultContextProperties} from '../../src/middlewares/source/defaultContextProperties'

describe('defaultContextPropertiesMiddleware', () => {
  const fakePayloadFactory = () => ({
    obj: {
      properties: {},
      context: {}
    }
  })

  beforeEach(() => {
    setConfig('defaultContext', undefined)
  })

  it('should add the context default properties if defined', () => {
    const payload = fakePayloadFactory()
    setConfig('defaultContext', {
      site: 'fotocasa'
    })

    const spy = sinon.spy()
    defaultContextProperties({payload, next: spy})
    const [{obj}] = spy.args[0]

    expect(obj.context).to.deep.equal({
      platform: 'web',
      site: 'fotocasa'
    })
  })

  it('should add the context default properties if config not defined', () => {
    const payload = fakePayloadFactory()

    const spy = sinon.spy()
    defaultContextProperties({payload, next: spy})
    const [{obj}] = spy.args[0]

    expect(obj.context).to.deep.equal({
      platform: 'web'
    })
  })
})

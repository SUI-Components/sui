import {expect} from 'chai'
import sinon from 'sinon'

import {initTracker} from '../../src/index.js'

const Mushroom = {
  start: () => {}
}

describe('initTracker', () => {
  let mushroomStub

  beforeEach(() => {
    mushroomStub = sinon.stub(Mushroom, 'start')
  })

  afterEach(() => {
    mushroomStub.restore()
  })

  it('initialize tracker with the expected config', () => {
    initTracker({Mushroom, appName: 'test', version: '1.0.0', config: {foo: 'bar'}})

    expect(mushroomStub.calledOnce).to.equal(true)
    mushroomStub.calledWith('test', {
      config: {foo: 'bar'},
      context: {environment: undefined, isServer: 'false', version: '1.0.0'}
    })
  })
  it('initialize tracker with tenant', () => {
    initTracker({Mushroom, appName: 'test', version: '1.0.0', tenant: 'infojobs', config: {foo: 'bar'}})

    expect(mushroomStub.calledOnce).to.equal(true)
    mushroomStub.calledWith('test', {
      config: {foo: 'bar'},
      context: {environment: undefined, isServer: 'false', version: '1.0.0', tenant: 'infojobs'}
    })
  })
  it('initialize tracker with a defined environment', () => {
    initTracker({
      Mushroom,
      appName: 'test',
      environment: 'production',
      version: '1.0.0',
      config: {}
    })

    expect(mushroomStub.calledOnce).to.equal(true)
    expect(
      mushroomStub.calledWith('test', {
        config: {},
        context: {
          environment: 'production',
          isServer: 'false',
          version: '1.0.0',
          tenant: undefined
        }
      })
    ).to.equal(true)
  })
})

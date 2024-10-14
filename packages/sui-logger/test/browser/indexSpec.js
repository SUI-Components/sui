import {expect} from 'chai'
import sinon from 'sinon'

import {initTracker} from '../../src/index.js'

const Reporter = {
  start: () => {}
}

describe('initTracker', () => {
  let reporterStub

  beforeEach(() => {
    reporterStub = sinon.stub(Reporter, 'start')
  })

  afterEach(() => {
    reporterStub.restore()
  })

  it('initialize tracker with the expected config', () => {
    initTracker({Reporter, appName: 'test', version: '1.0.0', config: {foo: 'bar'}})

    expect(reporterStub.calledOnce).to.equal(true)
    reporterStub.calledWith('test', {
      config: {foo: 'bar'},
      context: {environment: undefined, isServer: 'false', version: '1.0.0'}
    })
  })
  it('initialize tracker with tenant', () => {
    initTracker({Reporter, appName: 'test', version: '1.0.0', tenant: 'infojobs', config: {foo: 'bar'}})

    expect(reporterStub.calledOnce).to.equal(true)
    reporterStub.calledWith('test', {
      config: {foo: 'bar'},
      context: {environment: undefined, isServer: 'false', version: '1.0.0', tenant: 'infojobs'}
    })
  })
  it('initialize tracker with a defined environment', () => {
    initTracker({
      Reporter,
      appName: 'test',
      environment: 'production',
      version: '1.0.0',
      config: {}
    })

    expect(reporterStub.calledOnce).to.equal(true)
    expect(
      reporterStub.calledWith('test', {
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

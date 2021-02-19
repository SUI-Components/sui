import {expect} from 'chai'
import {PDE as SuiPDE} from '../../src'
import OptimizelyAdapter from '../../src/adapters/optimizely'
import DefaultAdapter from '../../src/adapters/default'
import sinon from 'sinon'

import {descriptorsByEnvironmentPatcher} from '@s-ui/test/lib/descriptor-environment-patcher'

descriptorsByEnvironmentPatcher()
describe('@s-ui pde', () => {
  let optimizelyInstanceStub
  let optimizelyAdapter

  beforeEach(() => {
    optimizelyInstanceStub = {
      activate: sinon.stub().returns('variationA'),
      onReady: async () => true,
      getEnabledFeatures: async () => ['a', 'b']
    }
    optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: '123'
    })
  })

  it('works with the default adapter', done => {
    const ab = new SuiPDE()
    ab.getEnabledFeatures()
      .then(features => {
        expect(features).to.be.an('array')
        done()
      })
      .catch(done)
  })

  it('works with Optimizely Adapter', done => {
    const ab = new SuiPDE({
      adapter: optimizelyAdapter
    })
    ab.getEnabledFeatures()
      .then(features => {
        expect(features).to.deep.equal(['a', 'b'])
        done()
      })
      .catch(done)
  })

  it('should call optimizelys sdk activate fn', () => {
    const variationName = optimizelyAdapter.activateExperiment({
      name: 'fakeTest'
    })
    expect(variationName).to.equal('variationA')
    expect(optimizelyInstanceStub.activate.called).to.equal(true)
  })

  it('loads the default adapter when the user gives no consent', () => {
    const pde = new SuiPDE({hasUserConsents: false})

    expect(pde._adapter).to.be.instanceOf(DefaultAdapter)
  })

  it('loads the default adapter variation when no userId set', () => {
    const optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub
    })

    expect(optimizelyAdapter.activateExperiment({name: 'fakeTest'})).to.equal(
      null
    )
    expect(optimizelyInstanceStub.activate.notCalled).to.equal(true)
  })

  it('saves the userId as string', () => {
    const optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: 234
    })
    expect(typeof optimizelyAdapter._userId).to.equal('string')
  })

  it.client(
    'uses the optimizely adapter by default as global object to integrate with segment',
    () => {
      delete window.optimizelyClientInstance
      // own copy to ensure to be able to test if it's the same object as added to the window
      const optimizelyInstanceStub = {
        activate: sinon.stub().returns('variationA'),
        onReady: async () => true,
        getEnabledFeatures: async () => ['a', 'b']
      }
      // only executed to create window.optimizelyClientInstance
      // eslint-disable-next-line no-new
      new OptimizelyAdapter({
        optimizely: optimizelyInstanceStub,
        userId: '123'
      })
      // eslint-disable-next-line eqeqeq
      expect(window.optimizelyClientInstance == optimizelyInstanceStub).to.be
        .true
    }
  )

  it.client('does not create segment integration if passed by as off', () => {
    delete window.optimizelyClientInstance
    optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: '123',
      activeIntegrations: {segment: false}
    })
    expect(window.optimizelyClientInstance).to.not.exist
  })

  it.client('loads datafile if set', () => {
    window.__INITIAL_CONTEXT_VALUE__ = {pde: {initialDatafile: true}}
    const optimizelySDK = {
      setLogger: () => {},
      setLogLevel: () => {},
      logging: {
        createLogger: () => {}
      },
      createInstance: sinon.spy()
    }
    OptimizelyAdapter.createOptimizelyInstance({
      optimizely: optimizelySDK
    })
    expect(optimizelySDK.createInstance.calledOnce)

    expect(
      optimizelySDK.createInstance.firstCall.args[0].datafile
    ).to.deep.equal({initialDatafile: true})
  })
})

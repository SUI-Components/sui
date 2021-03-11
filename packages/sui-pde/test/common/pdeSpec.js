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
      getEnabledFeatures: async () => ['a', 'b'],
      getVariation: sinon.stub().returns('variationB')
    }
    optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: 'user123',
      hasUserConsents: true
    })
  })

  it('loads the default adapter features', done => {
    const ab = new SuiPDE()
    ab.getEnabledFeatures()
      .then(features => {
        expect(features).to.be.an('array')
        expect(features.length).to.equal(0)
        done()
      })
      .catch(done)
  })

  it('loads the Optimizely Adapter features', done => {
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

  it('loads the Optimizely Adapter features even when no test consents', done => {
    const ab = new SuiPDE({
      adapter: optimizelyAdapter,
      hasUserConsents: false
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
      name: 'fakeTest',
      attributes: {
        attr: 'attrValue'
      }
    })
    expect(variationName).to.equal('variationA')
    expect(optimizelyInstanceStub.activate.called).to.equal(true)
    expect(optimizelyInstanceStub.activate.args[0][0]).to.equal('fakeTest')
    expect(optimizelyInstanceStub.activate.args[0][1]).to.equal('user123')
    expect(optimizelyInstanceStub.activate.args[0][2]).to.deep.equal({
      attr: 'attrValue'
    })
  })

  it('should call optimizelys sdk getVariation fn', () => {
    const variationName = optimizelyAdapter.getVariation({
      name: 'fakeTest',
      attributes: {
        attr: 'attrValue'
      }
    })
    expect(variationName).to.equal('variationB')
    expect(optimizelyInstanceStub.getVariation.called).to.equal(true)
    expect(optimizelyInstanceStub.getVariation.args[0][0]).to.equal('fakeTest')
    expect(optimizelyInstanceStub.getVariation.args[0][1]).to.equal('user123')
    expect(optimizelyInstanceStub.getVariation.args[0][2]).to.deep.equal({
      attr: 'attrValue'
    })
  })

  it('loads the default adapter when no adapter is passed by', () => {
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
        userId: '123',
        hasUserConsents: true
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
      activeIntegrations: {segment: false},
      hasUserConsents: true
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

  it('loads the default variation when no consents given', () => {
    const optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: 'user123',
      hasUserConsents: false
    })
    const pde = new SuiPDE({
      adapter: optimizelyAdapter,
      hasUserConsents: false
    })
    expect(pde.activateExperiment({name: 'test'})).to.be.null
  })
})

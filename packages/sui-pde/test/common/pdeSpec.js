import {expect} from 'chai'
import sinon from 'sinon'

import {descriptorsByEnvironmentPatcher} from '@s-ui/test/lib/descriptor-environment-patcher.js'

import DefaultAdapter from '../../src/adapters/default.js'
import OptimizelyAdapter from '../../src/adapters/optimizely/index.js'
import MultipleOptimizelyAdapter from '../../src/adapters/optimizely/multiple.js'
import {SESSION_STORAGE_KEY as PDE_CACHE_STORAGE_KEY} from '../../src/hooks/common/trackedEventsLocalCache.js'
import {PDE as SuiPDE} from '../../src/index.js'

descriptorsByEnvironmentPatcher()

describe('@s-ui pde', () => {
  let optimizelyInstanceStub
  let optimizelyAdapter

  const createOptimizelyInstanceStub = ({
    activate = 'variationA',
    getEnabledFeatures = ['a', 'b'],
    isFeatureEnabled = true,
    getVariation = 'variationB'
  } = {}) => {
    const stub = {
      onReadyStub: sinon.stub().returns(true),
      getDatafileStub: sinon.stub().returns({}),
      activate: sinon.stub().returns(activate),
      onReady: async () => stub.onReadyStub(),
      getEnabledFeatures: () => getEnabledFeatures,
      isFeatureEnabled: sinon.stub().returns(isFeatureEnabled),
      getVariation: sinon.stub().returns(getVariation),
      getOptimizelyConfig: () => ({
        featuresMap: {
          featureUsedInTest: {
            experimentsMap: {
              1234: {}
            }
          },
          featureNotUsedInTest: {
            experimentsMap: {}
          }
        },
        getDatafile: () => stub.getDatafileStub()
      }),
      setLogLevel: () => null,
      setLogger: () => null,
      logging: {
        createLogger: () => null
      },
      createInstance: sinon.stub()
    }
    stub.createInstance.returns(stub)
    return stub
  }

  beforeEach(() => {
    optimizelyInstanceStub = createOptimizelyInstanceStub()
    optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: 'user123',
      hasUserConsents: true
    })
  })

  afterEach(() => {
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(PDE_CACHE_STORAGE_KEY)
  })

  it('loads the default adapter features', () => {
    const ab = new SuiPDE()
    const features = ab.getEnabledFeatures()
    expect(features).to.be.an('array')
    expect(features.length).to.equal(0)
  })

  it('loads the Optimizely Adapter features', () => {
    const ab = new SuiPDE({
      adapter: optimizelyAdapter
    })
    const features = ab.getEnabledFeatures()
    expect(features).to.deep.equal(['a', 'b'])
  })

  it('loads the Optimizely Adapter features even when no test consents', () => {
    const ab = new SuiPDE({
      adapter: optimizelyAdapter,
      hasUserConsents: false
    })
    const features = ab.getEnabledFeatures()
    expect(features).to.deep.equal(['a', 'b'])
  })

  it('shouldnt load feature when its being used in an experiment and the user has not given his consent', () => {
    const pde = new SuiPDE({
      adapter: optimizelyAdapter,
      hasUserConsents: false
    })
    const {isActive, linkedExperiments} = pde.isFeatureEnabled({
      featureKey: 'featureUsedInTest'
    })
    expect(isActive).to.equal(false)
    expect(linkedExperiments).to.deep.equal([])
    expect(optimizelyInstanceStub.isFeatureEnabled.called).to.equal(false)
  })

  it('should load a feture that is being used in an experiment when the user has given his consents', () => {
    const pde = new SuiPDE({
      adapter: optimizelyAdapter,
      hasUserConsents: true
    })
    const {isActive, linkedExperiments} = pde.isFeatureEnabled({
      featureKey: 'featureUsedInTest'
    })
    expect(isActive).to.equal(true)
    expect(linkedExperiments).to.deep.equal(['1234'])
    expect(optimizelyInstanceStub.isFeatureEnabled.called).to.equal(true)
    expect(optimizelyInstanceStub.isFeatureEnabled.args[0][0]).to.equal('featureUsedInTest')
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

    expect(optimizelyAdapter.activateExperiment({name: 'fakeTest'})).to.equal(null)
    expect(optimizelyInstanceStub.activate.notCalled).to.equal(true)
  })

  it('saves the userId as string', () => {
    const optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: 234
    })
    expect(typeof optimizelyAdapter._userId).to.equal('string')
  })

  it('loads attributes set by application on every activate experiment', () => {
    optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: 'user123',
      hasUserConsents: true,
      applicationAttributes: {
        environment: 'production',
        site: 'mysite.com'
      }
    })
    optimizelyAdapter.activateExperiment({
      name: 'fakeTest',
      attributes: {
        attr: 'attrValue'
      }
    })
    expect(optimizelyInstanceStub.activate.args[0][2]).to.deep.equal({
      environment: 'production',
      site: 'mysite.com',
      attr: 'attrValue'
    })
  })

  it('loads attributes set by application on every get variation', () => {
    optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: 'user123',
      hasUserConsents: true,
      applicationAttributes: {
        environment: 'production',
        site: 'mysite.com'
      }
    })
    optimizelyAdapter.getVariation({
      name: 'fakeTest',
      attributes: {
        attr: 'attrValue'
      }
    })
    expect(optimizelyInstanceStub.getVariation.args[0][2]).to.deep.equal({
      environment: 'production',
      site: 'mysite.com',
      attr: 'attrValue'
    })
  })

  it.client('uses the optimizely adapter by default as global object to integrate with segment', () => {
    delete window.optimizelyClientInstance
    // own copy to ensure to be able to test if it's the same object as added to the window
    const optimizelyInstanceStub = {
      activate: sinon.stub().returns('variationA'),
      onReady: async () => true,
      getEnabledFeatures: () => ['a', 'b']
    }
    // only executed to create window.optimizelyClientInstance
    // eslint-disable-next-line no-new
    new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: '123',
      hasUserConsents: true
    })
    // eslint-disable-next-line eqeqeq
    expect(window.optimizelyClientInstance == optimizelyInstanceStub).to.be.true
  })

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

  it('should merge the application attributes with the feature attributes', () => {
    optimizelyAdapter = new OptimizelyAdapter({
      optimizely: optimizelyInstanceStub,
      userId: '123',
      activeIntegrations: {segment: false},
      hasUserConsents: true,
      applicationAttributes: {applicationKey: 'applicationValue'}
    })
    const pde = new SuiPDE({
      adapter: optimizelyAdapter
    })
    pde.isFeatureEnabled({
      featureKey: 'featureUsedInTest',
      attributes: {featureKey: 'featureValue'}
    })
    expect(optimizelyInstanceStub.isFeatureEnabled.args[0][2]).to.deep.equal({
      applicationKey: 'applicationValue',
      featureKey: 'featureValue'
    })
  })

  describe('using multiple optimizely instances', () => {
    const defaultAdapterId = 'defaultOptimizely'
    const alternateAdapterId = 'alternateOptimizely'
    const defaultInstanceActiveVariation = 'defaultVariationA'
    const alternateInstanceActiveVariation = 'alternateVariationA'

    let defaultInstance
    let alternateInstance
    let multipleAdapterInstances
    let multipleAdapter
    let pde

    beforeEach(() => {
      defaultInstance = createOptimizelyInstanceStub({
        activate: defaultInstanceActiveVariation
      })
      alternateInstance = createOptimizelyInstanceStub({
        activate: alternateInstanceActiveVariation
      })
      multipleAdapterInstances = MultipleOptimizelyAdapter.createMultipleOptimizelyInstances({
        [defaultAdapterId]: {optimizely: defaultInstance},
        [alternateAdapterId]: {optimizely: alternateInstance}
      })
      multipleAdapter = new MultipleOptimizelyAdapter({
        [defaultAdapterId]: {
          optimizely: multipleAdapterInstances[defaultAdapterId]
        },
        [alternateAdapterId]: {
          optimizely: multipleAdapterInstances[alternateAdapterId]
        }
      })
      pde = new SuiPDE({adapter: multipleAdapter, hasUserConsents: true})
    })

    it('should use first instance adapter id as default', () => {
      const variationOnDefaultWithoutAdapterId = pde.activateExperiment({
        name: 'default-test'
      })
      const variationOnDefaultWithAdapterId = pde.activateExperiment({
        name: 'default-test',
        adapterId: defaultAdapterId
      })
      expect(variationOnDefaultWithAdapterId).to.equal(variationOnDefaultWithoutAdapterId)
      expect(variationOnDefaultWithAdapterId).to.equal(defaultInstanceActiveVariation)
    })

    it('should use alternate adapter id', () => {
      const variationOnAlternateWithAdapterId = pde.activateExperiment({
        name: 'default-test',
        adapterId: alternateAdapterId
      })
      expect(variationOnAlternateWithAdapterId).to.equal(alternateInstanceActiveVariation)
    })

    it('should be ready on multiple instances', async () => {
      await multipleAdapter.onReady()
      expect(defaultInstance.onReadyStub.called).to.be.true
      expect(alternateInstance.onReadyStub.called).to.be.true
    })

    it('should get initial data', () => {
      const initialData = multipleAdapter.getInitialData()
      expect(defaultInstance.getDatafileStub.called).to.be.true
      expect(alternateInstance.getDatafileStub.called).to.be.true
      expect(initialData).to.deep.equal({
        [defaultAdapterId]: {},
        [alternateAdapterId]: {}
      })
    })

    it.client('should initialize with initial data', () => {
      window.__INITIAL_CONTEXT_VALUE__ = {
        pde: {
          [defaultAdapterId]: {initialDatafile: defaultAdapterId},
          [alternateAdapterId]: {initialDatafile: alternateAdapterId}
        }
      }
      const optimizelySDK1 = createOptimizelyInstanceStub()
      const optimizelySDK2 = createOptimizelyInstanceStub()

      MultipleOptimizelyAdapter.createMultipleOptimizelyInstances({
        [defaultAdapterId]: {optimizely: optimizelySDK1},
        [alternateAdapterId]: {optimizely: optimizelySDK2}
      })

      expect(optimizelySDK1.createInstance.firstCall.args[0].datafile).to.deep.equal({
        initialDatafile: defaultAdapterId
      })
      expect(optimizelySDK2.createInstance.firstCall.args[0].datafile).to.deep.equal({
        initialDatafile: alternateAdapterId
      })
    })

    it('should accept a single adapter', () => {
      multipleAdapter = new MultipleOptimizelyAdapter({
        [alternateAdapterId]: {
          optimizely: multipleAdapterInstances[alternateAdapterId]
        }
      })
      pde = new SuiPDE({adapter: multipleAdapter, hasUserConsents: true})
      const variationWithoutAdapterId = pde.activateExperiment({
        name: 'default-test'
      })
      const variationWithAdapterId = pde.activateExperiment({
        name: 'default-test',
        adapterId: alternateAdapterId
      })
      expect(variationWithoutAdapterId).to.equal(variationWithAdapterId)
      expect(variationWithAdapterId).to.equal(alternateInstanceActiveVariation)
    })
  })
})

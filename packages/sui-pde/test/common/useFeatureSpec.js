/* eslint-disable no-console */
import {cleanup, renderHook} from '@testing-library/react-hooks'
import {expect} from 'chai'
import PdeContext from '../../src/contexts/PdeContext'
import useFeature from '../../src/hooks/useFeature'
import {LOCAL_STORAGE_KEY as PDE_CACHE_STORAGE_KEY} from '../../src/hooks/common/trackedEventsLocalCache'
import sinon from 'sinon'

describe('when pde context is set', () => {
  const variables = {variable: 'variable'}
  let wrapper

  afterEach(() => {
    cleanup()
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(PDE_CACHE_STORAGE_KEY)
  })

  describe('when no experiment is linked', () => {
    let isFeatureEnabled
    let getAllFeatureVariables
    beforeEach(() => {
      isFeatureEnabled = sinon
        .stub()
        .returns({isActive: true, linkedExperiments: []})
      getAllFeatureVariables = sinon.stub().returns(variables)

      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider
          value={{pde: {isFeatureEnabled, getAllFeatureVariables}}}
        >
          {children}
        </PdeContext.Provider>
      )
    })

    it('should check if a feature is enabled', () => {
      const {result} = renderHook(
        () => useFeature('featureKey1', {attribute1: 'value'}),
        {wrapper}
      )
      expect(result.current.isActive).to.equal(true)
      expect(isFeatureEnabled.called).to.equal(true)
      expect(isFeatureEnabled.args[0][0]).to.deep.equal({
        featureKey: 'featureKey1',
        attributes: {attribute1: 'value'}
      })
    })

    it('should return feature variables', () => {
      const {result} = renderHook(
        () => useFeature('featureKey2', {attribute1: 'value'}),
        {wrapper}
      )

      expect(result.current.variables).to.be.deep.equal(variables)
      expect(isFeatureEnabled.called).to.equal(true)
      expect(isFeatureEnabled.args[0][0]).to.deep.equal({
        featureKey: 'featureKey2',
        attributes: {attribute1: 'value'}
      })
    })

    describe.client('and the hook is executed by the browser', () => {
      it('should check that a feature has been forced to be active', () => {
        const {result} = renderHook(
          () => useFeature('featureKey3', {}, '?suipde_feature1=on'),
          {wrapper}
        )
        expect(result.current.isActive).to.equal(true)
      })

      it('should check that a feature has been forced to be not active', () => {
        const {result} = renderHook(
          () =>
            useFeature(
              'featureKey3',
              {},
              '?suipde_featureKey3=off&suipde_feature1=on'
            ),
          {wrapper}
        )
        expect(result.current.isActive).to.equal(false)
      })
    })
  })

  describe.client(
    'when checking if a feature flag is active or not in browser',
    () => {
      let isFeatureEnabled
      let getAllFeatureVariables
      let getVariation

      describe.client('when a feature flag is active', () => {
        beforeEach(() => {
          isFeatureEnabled = sinon.stub().returns({
            isActive: true,
            linkedExperiments: []
          })
          getAllFeatureVariables = sinon.stub().returns(variables)
          getVariation = sinon.stub().returns('variation1')

          window.analytics = {
            ready: cb => cb(),
            track: sinon.spy()
          }

          // eslint-disable-next-line react/prop-types
          wrapper = ({children}) => (
            <PdeContext.Provider
              value={{
                pde: {isFeatureEnabled, getAllFeatureVariables, getVariation}
              }}
            >
              {children}
            </PdeContext.Provider>
          )
        })

        afterEach(() => {
          delete window.analytics
        })

        it('should send the on state experiment viewed', () => {
          renderHook(() => useFeature('activeFeatureFlagKey'), {
            wrapper
          })
          expect(window.analytics.track.args[0][0]).to.equal(
            'Experiment Viewed'
          )
          expect(window.analytics.track.args[0][1]).to.deep.equal({
            experimentName: 'activeFeatureFlagKey',
            variationName: 'On State'
          })
        })

        describe.client('when a feature is seen twice', () => {
          it('should only track one experiment viewed event', () => {
            renderHook(() => useFeature('repeatedFeatureFlagKey'), {
              wrapper
            })
            renderHook(() => useFeature('repeatedFeatureFlagKey'), {
              wrapper
            })
            expect(window.analytics.track.args.length).to.equal(1)
          })
        })
      })

      describe.client('when a feature flag is deactivated', () => {
        beforeEach(() => {
          isFeatureEnabled = sinon.stub().returns({
            isActive: false,
            linkedExperiments: []
          })
          getAllFeatureVariables = sinon.stub().returns(variables)
          getVariation = sinon.stub().returns('variation1')

          window.analytics = {
            ready: cb => cb(),
            track: sinon.spy()
          }

          // eslint-disable-next-line react/prop-types
          wrapper = ({children}) => (
            <PdeContext.Provider
              value={{
                pde: {isFeatureEnabled, getAllFeatureVariables, getVariation}
              }}
            >
              {children}
            </PdeContext.Provider>
          )
        })

        afterEach(() => {
          delete window.analytics
        })

        it('should send the off state experiment viewed', () => {
          renderHook(() => useFeature('notActiveFeatureFlagKey'), {
            wrapper
          })
          expect(window.analytics.track.args[0][0]).to.equal(
            'Experiment Viewed'
          )
          expect(window.analytics.track.args[0][1]).to.deep.equal({
            experimentName: 'notActiveFeatureFlagKey',
            variationName: 'Off State'
          })
        })
      })
    }
  )

  describe.client('when its a feature test, so an experiment is linked', () => {
    let isFeatureEnabled
    let getAllFeatureVariables
    let getVariation

    beforeEach(() => {
      isFeatureEnabled = sinon.stub().returns({
        isActive: true,
        linkedExperiments: ['abtest_fake_id', 'abtest_second_fake_id'] // definition of linked experimentIds
      })
      getAllFeatureVariables = sinon.stub().returns(variables)
      getVariation = sinon.stub().returns('variation1')

      window.analytics = {
        ready: cb => cb(),
        track: sinon.spy()
      }

      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider
          value={{
            pde: {
              isFeatureEnabled,
              getAllFeatureVariables,
              getVariation
            }
          }}
        >
          {children}
        </PdeContext.Provider>
      )
    })

    afterEach(() => {
      delete window.analytics
    })

    it('should send experiment viewed event for every test asociated and the experiment viewed associated to the feature flag itself', () => {
      renderHook(() => useFeature('featureKey4', {attribute1: 'value'}), {
        wrapper
      })

      // feature being called
      expect(window.analytics.track.args[0][0]).to.equal('Experiment Viewed')
      expect(window.analytics.track.args[0][1]).to.deep.equal({
        experimentName: 'featureKey4',
        variationName: 'On State'
      })

      // first experiment linked to the feature
      expect(window.analytics.track.args[1][0]).to.equal('Experiment Viewed')
      expect(window.analytics.track.args[1][1]).to.deep.equal({
        experimentName: 'abtest_fake_id',
        variationName: 'variation1'
      })

      // second experiment linked to the feature
      expect(window.analytics.track.args[2][0]).to.equal('Experiment Viewed')
      expect(window.analytics.track.args[2][1]).to.deep.equal({
        experimentName: 'abtest_second_fake_id',
        variationName: 'variation1'
      })
    })
  })

  describe.client(
    'when calling twice the useFeature hook with the same feature key',
    () => {
      let getAllFeatureVariables
      let getVariation
      let stubFactory

      beforeEach(() => {
        window.analytics = {
          ready: cb => cb(),
          track: sinon.spy()
        }

        stubFactory = isFeatureEnabled => {
          getAllFeatureVariables = sinon.stub().returns(variables)

          // eslint-disable-next-line react/prop-types
          wrapper = ({children}) => (
            <PdeContext.Provider
              value={{
                pde: {
                  isFeatureEnabled,
                  getAllFeatureVariables,
                  getVariation
                }
              }}
            >
              {children}
            </PdeContext.Provider>
          )
        }
      })

      afterEach(() => {
        delete window.analytics
      })

      describe('when the second time returns the same value as the first time', () => {
        beforeEach(() => {
          const isFeatureEnabled = sinon.stub()
          isFeatureEnabled.onCall(0).returns({
            isActive: true
          })
          isFeatureEnabled.onCall(1).returns({
            isActive: true
          })

          stubFactory(isFeatureEnabled)
        })
        it('should send only one experiment viewed event', () => {
          renderHook(() => useFeature('repeatedFeatureFlagKey'), {
            wrapper
          })
          renderHook(() => useFeature('repeatedFeatureFlagKey'), {
            wrapper
          })
          expect(window.analytics.track.args.length).to.equal(1)
        })
      })

      describe('when the second time returns a different value as the first time', () => {
        beforeEach(() => {
          const isFeatureEnabled = sinon.stub()
          isFeatureEnabled.onCall(0).returns({
            isActive: true
          })
          isFeatureEnabled.onCall(1).returns({
            isActive: false
          })

          stubFactory(isFeatureEnabled)
        })
        it('should send two experiment viewed events', () => {
          renderHook(() => useFeature('repeatedFeatureFlagKey'), {
            wrapper
          })
          renderHook(() => useFeature('repeatedFeatureFlagKey'), {
            wrapper
          })
          expect(window.analytics.track.args.length).to.equal(2)
        })
      })
    }
  )
})

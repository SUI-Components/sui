/* eslint-disable no-console */
import {expect} from 'chai'
import sinon from 'sinon'

import {cleanup, renderHook} from '@testing-library/react-hooks'
import {descriptorsByEnvironmentPatcher} from '@s-ui/test/lib/descriptor-environment-patcher.js'

import PdeContext from '../../src/contexts/PdeContext.js'
import {SESSION_STORAGE_KEY as PDE_CACHE_STORAGE_KEY} from '../../src/hooks/common/trackedEventsLocalCache.js'
import useDecision from '../../src/hooks/useDecision.js'

descriptorsByEnvironmentPatcher()

describe('useDecision hook', () => {
  afterEach(() => {
    cleanup()
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(PDE_CACHE_STORAGE_KEY)
  })

  describe('when no pde context is set', () => {
    it('should throw an error', () => {
      const {result} = renderHook(() => useDecision())
      expect(result.error).to.not.be.null
    })
  })

  describe('when pde context is set', () => {
    let wrapper
    let decide

    before(() => {
      const decision = {
        variationKey: 'variation',
        enabled: true,
        variables: {},
        ruleKey: 'rule',
        flagKey: 'flag',
        userContext: {},
        reasons: []
      }
      decide = sinon.stub().returns(decision)

      const addDecideListener = ({onDecide}) =>
        onDecide({type: 'flag', decisionInfo: {...decision, decisionEventDispatched: true}})
      const removeNotificationListener = sinon.stub()

      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider value={{features: [], pde: {decide, addDecideListener, removeNotificationListener}}}>
          {children}
        </PdeContext.Provider>
      )
    })

    describe.client('and the hook is executed by the browser', () => {
      describe('and window.analytics.track exists', () => {
        beforeEach(() => {
          window.analytics = {
            ready: cb => cb(),
            track: sinon.spy()
          }
          sinon.spy(console, 'error')
        })

        afterEach(() => {
          delete window.analytics
          console.error.restore()
        })

        it('should return the right variationName and launch the Experiment Viewed event', () => {
          const {result} = renderHook(() => useDecision('flag'), {
            wrapper
          })
          expect(result.current).to.be.deep.equal({
            variationKey: 'variation',
            enabled: true,
            variables: {},
            ruleKey: 'rule',
            flagKey: 'flag',
            userContext: {},
            reasons: []
          })
          sinon.assert.callCount(console.error, 0)
          sinon.assert.callCount(window.analytics.track, 1)
          expect(window.analytics.track.args[0][0]).to.equal('Experiment Viewed')
          expect(window.analytics.track.args[0][1]).to.deep.equal({
            variationName: 'variation',
            experimentName: 'rule'
          })
        })

        describe('when the flag is forced by query param', () => {
          it('should return the forced flag of a feature test', () => {
            const {result} = renderHook(
              () =>
                useDecision('flag', {
                  queryString: '?suipde_flag=off'
                }),
              {wrapper}
            )
            expect(result.current).to.be.deep.equal({
              enabled: false,
              flagKey: 'flag'
            })
          })
        })

        describe('when the variation is forced by query param', () => {
          it('should return the forced variation of a feature test', () => {
            const {result} = renderHook(
              () =>
                useDecision('rule', {
                  queryString: '?suipde_rule=variation_a'
                }),
              {wrapper}
            )
            expect(result.current).to.be.deep.equal({
              variationKey: 'variation_a',
              enabled: true,
              flagKey: 'rule'
            })
          })
        })

        describe('when the same experiment is loaded more than once', () => {
          it('should only track once', () => {
            renderHook(() => useDecision('flag'), {
              wrapper
            })
            renderHook(() => useDecision('flag'), {
              wrapper
            })
            expect(window.analytics.track.args.length).to.equal(1)
          })
        })
      })

      describe('and window.analytics.track does not exist', () => {
        beforeEach(() => {
          sinon.spy(console, 'error')
        })

        afterEach(() => {
          console.error.restore()
        })

        it('should return the right variationName and log an error', () => {
          delete window.analytics
          const {result} = renderHook(() => useDecision('flag'), {
            wrapper
          })
          expect(result.current).to.be.deep.equal({
            variationKey: 'variation',
            enabled: true,
            variables: {},
            ruleKey: 'rule',
            flagKey: 'flag',
            userContext: {},
            reasons: []
          })
          sinon.assert.callCount(console.error, 1)
          expect(console.error.args[0][0]).to.include('window.analytics.track expected')
        })
      })

      describe('and use a custom track function', () => {
        let customTrack

        before(() => {
          customTrack = sinon.spy()
          sinon.spy(console, 'error')
        })

        after(() => {
          customTrack = undefined
          console.error.restore()
        })

        it('should return the right variationName and execute custom track function', () => {
          const {result} = renderHook(
            () =>
              useDecision('test_experiment_id', {
                trackExperimentViewed: customTrack
              }),
            {
              wrapper
            }
          )
          expect(result.current).to.be.deep.equal({
            variationKey: 'variation',
            enabled: true,
            variables: {},
            ruleKey: 'rule',
            flagKey: 'flag',
            userContext: {},
            reasons: []
          })
          sinon.assert.callCount(console.error, 0)
          sinon.assert.callCount(customTrack, 1)
        })
      })
    })

    describe.server('and the hook is executed by the server', () => {
      before(() => {
        sinon.spy(console, 'error')
      })

      after(() => {
        console.error.restore()
      })

      it('should return the right variationName and launch the Experiment Viewed event', () => {
        const {result} = renderHook(() => useDecision('flag'), {
          wrapper
        })
        expect(result.current.variation).to.be.deep.equal({
          variationKey: 'variation',
          enabled: true,
          variables: {},
          ruleKey: 'rule',
          flagKey: 'flag',
          userContext: {},
          reasons: []
        })
        sinon.assert.callCount(console.error, 0)
      })
    })
  })

  describe('when the activation returns an error', () => {
    let decide
    let wrapper
    beforeEach(() => {
      decide = sinon.stub().throws(new Error('fake activation error'))
      const addDecideListener = sinon.stub()
      const removeNotificationListener = sinon.stub()

      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider value={{features: [], pde: {decide, addDecideListener, removeNotificationListener}}}>
          {children}
        </PdeContext.Provider>
      )
    })

    it('should return the default variation', () => {
      const {result} = renderHook(() => useDecision('flag'), {wrapper})
      expect(result.current).to.be.deep.equal({enabled: false, flagKey: 'flag'})
    })
  })

  describe.client('when calling twice the useDecision hook with the same feature key', () => {
    let wrapper
    let stubFactory

    beforeEach(() => {
      window.analytics = {
        ready: cb => cb(),
        track: sinon.spy()
      }

      const addDecideListener = sinon.stub()
      const removeNotificationListener = sinon.stub()

      stubFactory = decide => {
        // eslint-disable-next-line react/prop-types
        wrapper = ({children}) => (
          <PdeContext.Provider value={{features: [], pde: {decide, addDecideListener, removeNotificationListener}}}>
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
        const decide = sinon.stub()

        decide.onCall(0).returns({
          variationKey: 'variation',
          enabled: true,
          variables: {},
          ruleKey: 'rule',
          flagKey: 'flag',
          userContext: {},
          reasons: []
        })
        decide.onCall(1).returns({
          variationKey: 'variation',
          enabled: true,
          variables: {},
          ruleKey: 'rule',
          flagKey: 'flag',
          userContext: {},
          reasons: []
        })

        stubFactory(decide)
      })

      it('should send only one experiment viewed event', () => {
        renderHook(() => useDecision('flag'), {
          wrapper
        })
        renderHook(() => useDecision('flag'), {
          wrapper
        })
        expect(window.analytics.track.args.length).to.equal(1)
      })
    })

    describe('when the second time returns a different value as the first time', () => {
      beforeEach(() => {
        const decide = sinon.stub()

        decide.onCall(0).returns({
          variationKey: 'variation_a',
          enabled: true,
          variables: {},
          ruleKey: 'rule',
          flagKey: 'flag',
          userContext: {},
          reasons: []
        })
        decide.onCall(1).returns({
          variationKey: 'variation_b',
          enabled: true,
          variables: {},
          ruleKey: 'rule',
          flagKey: 'flag',
          userContext: {},
          reasons: []
        })

        stubFactory(decide)
      })

      it('should send two experiment viewed events', () => {
        renderHook(() => useDecision('flag'), {
          wrapper
        })
        renderHook(() => useDecision('flag'), {
          wrapper
        })
        expect(window.analytics.track.args.length).to.equal(2)
      })
    })
  })
})

/* eslint-disable no-console */
import {expect} from 'chai'
import sinon from 'sinon'

import {cleanup, renderHook} from '@testing-library/react-hooks'

import PdeContext from '../../src/contexts/PdeContext.js'
import {SESSION_STORAGE_KEY as PDE_CACHE_STORAGE_KEY} from '../../src/hooks/common/trackedEventsLocalCache.js'
import useExperiment from '../../src/hooks/useExperiment.js'

describe('useExperiment hook', () => {
  afterEach(() => {
    cleanup()
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(PDE_CACHE_STORAGE_KEY)
  })

  describe('when no pde context is set', () => {
    it('should throw an error', () => {
      const {result} = renderHook(() => useExperiment())
      expect(result.error).to.not.be.null
    })
  })

  describe('when pde context is set', () => {
    let activateExperiment
    let wrapper
    let getVariation

    before(() => {
      activateExperiment = sinon.stub().returns('activateExperimentA')
      getVariation = sinon.stub().returns('getVariationA')
      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider value={{features: [], pde: {activateExperiment, getVariation}}}>
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
          const {result} = renderHook(() => useExperiment({experimentName: 'test_experiment_id_1'}), {
            wrapper
          })
          expect(result.current.variation).to.equal('activateExperimentA')
          sinon.assert.callCount(console.error, 0)
          sinon.assert.callCount(window.analytics.track, 1)
          expect(window.analytics.track.args[0][0]).to.equal('Experiment Viewed')
          expect(window.analytics.track.args[0][1]).to.deep.equal({
            variationName: 'activateExperimentA',
            experimentName: 'test_experiment_id_1'
          })
        })

        describe('when the variation is forced by query param', () => {
          it('should return the forced variation of an experiment', () => {
            const {result} = renderHook(
              () =>
                useExperiment({
                  experimentName: 'experiment1',
                  queryString: '?suipde_experiment1=variation1'
                }),
              {wrapper}
            )
            expect(result.current.variation).to.equal('variation1')
          })
        })

        describe('when the same experiment is loaded more than once', () => {
          it('should only track once', () => {
            renderHook(() => useExperiment({experimentName: 'test_experiment_id'}), {
              wrapper
            })
            renderHook(() => useExperiment({experimentName: 'test_experiment_id'}), {
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
          const {result} = renderHook(() => useExperiment({experimentName: 'test_experiment_id_2'}), {
            wrapper
          })
          expect(result.current.variation).to.equal('activateExperimentA')
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
              useExperiment({
                experimentName: 'test_experiment_id',
                trackExperimentViewed: customTrack
              }),
            {
              wrapper
            }
          )
          expect(result.current.variation).to.equal('activateExperimentA')
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
        const {result} = renderHook(() => useExperiment({experimentName: 'test_experiment_id'}), {
          wrapper
        })
        expect(result.current.variation).to.equal('getVariationA')
        sinon.assert.callCount(console.error, 0)
      })
    })
  })

  describe('when the activation returns an error', () => {
    let activateExperiment
    let wrapper
    beforeEach(() => {
      activateExperiment = sinon.stub().throws(new Error('fake activation error'))
      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider value={{features: [], pde: {activateExperiment}}}>{children}</PdeContext.Provider>
      )
    })

    it('should return the default variation', () => {
      const {result} = renderHook(() => useExperiment(), {wrapper})
      expect(result.current.variation).to.equal(null)
    })
  })

  describe.client('when calling twice the useExperiment hook with the same feature key', () => {
    let wrapper
    let getVariation
    let stubFactory

    beforeEach(() => {
      window.analytics = {
        ready: cb => cb(),
        track: sinon.spy()
      }

      stubFactory = activateExperiment => {
        getVariation = sinon.stub().returns('getVariationA')
        // eslint-disable-next-line react/prop-types
        wrapper = ({children}) => (
          <PdeContext.Provider value={{features: [], pde: {activateExperiment, getVariation}}}>
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
        const activateExperiment = sinon.stub()
        activateExperiment.onCall(0).returns('A')
        activateExperiment.onCall(1).returns('A')

        stubFactory(activateExperiment)
      })
      it('should send only one experiment viewed event', () => {
        renderHook(() => useExperiment({experimentName: 'repeatedFeatureFlagKey'}), {
          wrapper
        })
        renderHook(() => useExperiment({experimentName: 'repeatedFeatureFlagKey'}), {
          wrapper
        })
        expect(window.analytics.track.args.length).to.equal(1)
      })
    })

    describe('when the second time returns a different value as the first time', () => {
      beforeEach(() => {
        const activateExperiment = sinon.stub()
        activateExperiment.onCall(0).returns('A')
        activateExperiment.onCall(1).returns('B')

        stubFactory(activateExperiment)
      })
      it('should send two experiment viewed events', () => {
        renderHook(() => useExperiment({experimentName: 'repeatedFeatureFlagKey'}), {
          wrapper
        })
        renderHook(() => useExperiment({experimentName: 'repeatedFeatureFlagKey'}), {
          wrapper
        })
        expect(window.analytics.track.args.length).to.equal(2)
      })
    })
  })
})

/* eslint-disable no-console */
import {cleanup, renderHook} from '@testing-library/react-hooks'
import {expect} from 'chai'
import PdeContext from '../../src/contexts/PdeContext'
import useExperiment from '../../src/hooks/useExperiment'
import sinon from 'sinon'

describe('useExperiment hook', () => {
  afterEach(cleanup)

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
        <PdeContext.Provider
          value={{features: [], pde: {activateExperiment, getVariation}}}
        >
          {children}
        </PdeContext.Provider>
      )
    })

    describe.client('and the hook is executed by the browser', () => {
      describe('and window.analytics.track exists', () => {
        before(() => {
          window.analytics = {
            ready: cb => cb(),
            track: sinon.spy()
          }
          sinon.spy(console, 'error')
        })

        after(() => {
          delete window.analytics
          console.error.restore()
        })

        it('should return the right variationName and launch the Experiment Viewed event', () => {
          const {result} = renderHook(
            () => useExperiment({experimentName: 'test_experiment_id'}),
            {
              wrapper
            }
          )
          expect(result.current.variation).to.equal('activateExperimentA')
          sinon.assert.callCount(console.error, 0)
          sinon.assert.callCount(window.analytics.track, 1)
          expect(window.analytics.track.args[0][0]).to.equal(
            'Experiment Viewed'
          )
          expect(window.analytics.track.args[0][1]).to.deep.equal({
            variationName: 'activateExperimentA',
            experimentName: 'test_experiment_id'
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
          const {result} = renderHook(
            () => useExperiment({experimentName: 'test_experiment_id'}),
            {
              wrapper
            }
          )
          expect(result.current.variation).to.equal('activateExperimentA')
          sinon.assert.callCount(console.error, 1)
          expect(console.error.args[0][0]).to.include(
            'window.analytics.track expected'
          )
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
        const {result} = renderHook(
          () => useExperiment({experimentName: 'test_experiment_id'}),
          {
            wrapper
          }
        )
        expect(result.current.variation).to.equal('getVariationA')
        sinon.assert.callCount(console.error, 0)
      })
    })
  })

  describe('when the activation returns an error', () => {
    let activateExperiment
    let wrapper
    beforeEach(() => {
      activateExperiment = sinon
        .stub()
        .throws(new Error('fake activation error'))
      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider value={{features: [], pde: {activateExperiment}}}>
          {children}
        </PdeContext.Provider>
      )
    })

    it('should return the default variation', () => {
      const {result} = renderHook(() => useExperiment(), {wrapper})
      expect(result.current.variation).to.equal(null)
    })
  })
})

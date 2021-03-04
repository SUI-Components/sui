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
    const activateExperiment = sinon.stub().returns('variationA')
    const wrapper = ({children}) => (
      <PdeContext.Provider value={{features: [], pde: {activateExperiment}}}>
        {children}
      </PdeContext.Provider>
    )

    it('should return the right variationName', () => {
      const {result} = renderHook(() => useExperiment(), {wrapper})
      expect(result.current.variation).to.equal('variationA')
    })
  })

  describe('when the activation returns an error', () => {
    const activateExperiment = sinon
      .stub()
      .throws(new Error('fake activation error'))
    const wrapper = ({children}) => (
      <PdeContext.Provider value={{features: [], pde: {activateExperiment}}}>
        {children}
      </PdeContext.Provider>
    )

    it('should return the default variation', () => {
      const {result} = renderHook(() => useExperiment(), {wrapper})
      expect(result.current.variation).to.equal(null)
    })
  })
})

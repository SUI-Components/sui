/* eslint-disable no-console */
import {cleanup, renderHook} from '@testing-library/react-hooks'
import {expect} from 'chai'
import PdeContext from '../../src/contexts/PdeContext'
import useFeature from '../../src/hooks/useFeature'
import sinon from 'sinon'

describe('when pde context is set', () => {
  let wrapper
  let getEnabledFeatures
  afterEach(cleanup)

  before(() => {
    getEnabledFeatures = sinon.stub().returns(['fakeFlag'])
    // eslint-disable-next-line react/prop-types
    wrapper = ({children}) => (
      <PdeContext.Provider value={{features: [], pde: {getEnabledFeatures}}}>
        {children}
      </PdeContext.Provider>
    )
  })

  describe.client('and the hook is executed by the browser', () => {
    it('should check that a feature has been forced to be active', () => {
      const {result} = renderHook(
        () => useFeature('feature1', {}, '?suipde_feature1=on'),
        {wrapper}
      )
      expect(result.current.isActive).to.equal(true)
    })

    it('should check that a feature has been forced to be not active', () => {
      const {result} = renderHook(
        () =>
          useFeature('feature2', {}, '?suipde_feature2=off&suipde_feature1=on'),
        {wrapper}
      )
      expect(result.current.isActive).to.equal(false)
    })
  })
})

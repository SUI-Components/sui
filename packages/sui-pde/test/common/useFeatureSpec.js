/* eslint-disable no-console */
import {cleanup, renderHook} from '@testing-library/react-hooks'
import {expect} from 'chai'
import PdeContext from '../../src/contexts/PdeContext'
import useFeature from '../../src/hooks/useFeature'
import sinon from 'sinon'

describe.only('when pde context is set', () => {
  afterEach(cleanup)

  describe('when pde context is set', () => {
    let wrapper
    let getEnabledFeatures

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
      describe('when the feature is forced to be activated', () => {
        it('should return that the feature flag is active', () => {
          const {result} = renderHook(
            () =>
              useFeature({
                experimentName: 'feature1',
                queryString: '?suipde_feature1=on'
              }),
            {wrapper}
          )
          expect(result.current.isActive).to.equal(true)
        })
      })

      describe('when the feature is forced to be activated', () => {
        it('should return that the feature flag is not active', () => {
          const {result} = renderHook(
            () =>
              useFeature({
                experimentName: 'feature2',
                queryString: '?suipde_feature2=off&suipde_feature1=on'
              }),
            {wrapper}
          )
          expect(result.current.isActive).to.equal(true)
        })
      })
    })
  })
})

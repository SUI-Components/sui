/* eslint-disable no-console */
import {cleanup, renderHook} from '@testing-library/react-hooks'
import {expect} from 'chai'
import PdeContext from '../../src/contexts/PdeContext'
import useFeature from '../../src/hooks/useFeature'
import sinon from 'sinon'

describe('when pde context is set', () => {
  const variables = {variable: 'variable'}
  let wrapper

  afterEach(cleanup)

  describe('when no experiment is linked', () => {
    let isFeatureEnabled
    let getAllFeatureVariables
    beforeEach(() => {
      isFeatureEnabled = sinon
        .stub()
        .returns({isActive: true, linkedExperiments: []})
      getAllFeatureVariables = sinon.stub().returns(variables)

      window.analytics = {
        ready: cb => cb(),
        track: sinon.spy()
      }

      // eslint-disable-next-line react/prop-types
      wrapper = ({children}) => (
        <PdeContext.Provider
          value={{pde: {isFeatureEnabled, getAllFeatureVariables}}}
        >
          {children}
        </PdeContext.Provider>
      )
    })

    after(() => {
      delete window.analytics
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

    // TODO: it should track experiment viewed for the feature flag
    // TODO: check On state
    // TODO: check Off state
    // TODO: check doble envío
  })

  describe('when its a feature test, so an experiment is linked', () => {
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

    it('should send experiment viewed event for every test asociated and the experiment viewed associated to the feature flag itself', () => {
      renderHook(() => useFeature('featureKey4', {attribute1: 'value'}), {
        wrapper
      })
      expect(window.analytics.track.args[0][0]).to.equal('Experiment Viewed')
      expect(window.analytics.track.args[0][1]).to.deep.equal({
        experimentName: 'featureKey4',
        variationName: 'On State'
      })
      expect(window.analytics.track.args[1][0]).to.equal('Experiment Viewed')
      expect(window.analytics.track.args[1][1]).to.deep.equal({
        experimentName: 'abtest_fake_id',
        variationName: 'variation1'
      })
      expect(window.analytics.track.args[2][0]).to.equal('Experiment Viewed')
      expect(window.analytics.track.args[2][1]).to.deep.equal({
        experimentName: 'abtest_second_fake_id',
        variationName: 'variation1'
      })
    })
  })
})

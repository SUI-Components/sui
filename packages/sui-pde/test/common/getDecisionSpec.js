/* eslint-disable no-console */
import {expect} from 'chai'
import sinon from 'sinon'

import {descriptorsByEnvironmentPatcher} from '@s-ui/test/lib/descriptor-environment-patcher.js'

import {SESSION_STORAGE_KEY as PDE_CACHE_STORAGE_KEY} from '../../src/hooks/common/trackedEventsLocalCache.js'
import getDecision from '../../src/getDecision.js'

descriptorsByEnvironmentPatcher()

describe('getDecision function', () => {
  afterEach(() => {
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(PDE_CACHE_STORAGE_KEY)
  })

  describe('when no pde context is set', () => {
    it('should throw an error', () => {
      try {
        getDecision()
      } catch (error) {
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('when pde context is set', () => {
    let decide, pde
    const decision = {
      variationKey: 'variation',
      enabled: true,
      variables: {},
      ruleKey: 'rule',
      flagKey: 'flag',
      userContext: {},
      reasons: []
    }

    before(() => {
      const addDecideListener = ({onDecide}) =>
        onDecide({type: 'flag', decisionInfo: {...decision, decisionEventDispatched: true}})
      const removeNotificationListener = sinon.stub()

      decide = () => decision
      pde = {decide, addDecideListener, removeNotificationListener}
    })

    it('should return a decision', () => {
      const {decide} = getDecision(pde)
      expect(decide('flag')).to.deep.equal(decision)
    })
  })
})

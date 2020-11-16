import {expect} from 'chai'
import sinon from 'sinon'

import invariant from '../../src/internal/invariant'
import warning from '../../src/internal/warning'

describe('Utils', () => {
  describe('invariant', () => {
    it('should throw an error if condition passed is falsy', () => {
      const invariationExecution = () => invariant(false, 'Error Message')
      expect(invariationExecution).to.throw(Error, 'Error Message')
    })

    it('should do nothing if condition passed is truthy', () => {
      const invariationExecution = () => invariant(true, 'Error Message')
      expect(invariationExecution).to.not.throw()
    })
  })

  describe('warning', () => {
    let spyWarn

    beforeEach(() => {
      spyWarn = sinon.spy(console, 'warn')
    })

    afterEach(() => {
      spyWarn.restore()
    })

    it('should log a warning if condition passed is falsy', () => {
      warning(false, 'Warning Message')
      expect(spyWarn.calledWith('Warning Message')).to.be.true
    })

    it('should do nothing if condition passed is truthy', () => {
      warning(true, 'Warning Message')
      expect(spyWarn.calledWith('Warning Message')).to.be.false
    })
  })

  describe('match', () => {})
})

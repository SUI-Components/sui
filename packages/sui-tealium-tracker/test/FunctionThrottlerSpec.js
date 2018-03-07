/* eslint-env mocha */
import { expect } from 'chai'
import sinon from 'sinon'
import { FunctionThrottler } from '../src/FunctionThrottler'

describe('FunctionThrottler', () => {
  let callback
  let throttledFunction
  before(() => {
    callback = sinon.spy()
    throttledFunction = FunctionThrottler.throttle(callback, 200)
  })

  it('should call the callback after a execution gap of 200 MS between calls if first was executed', (done) => {
    throttledFunction()

    setTimeout(() => {
      expect(callback.callCount).to.be.equal(1)
    }, 200)

    setTimeout(() => {
      throttledFunction()
      expect(callback.callCount).to.be.equal(1)
    }, 150)

    setTimeout(() => {
      throttledFunction()
      expect(callback.callCount).to.be.equal(2)
      done()
    }, 200)
  })
})

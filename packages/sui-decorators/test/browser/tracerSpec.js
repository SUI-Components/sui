/* eslint-disable no-unused-expressions */
import {expect} from 'chai'
import sinon from 'sinon'
import {inlineError, tracer} from '../../src'
import {ConsoleReporter} from '../../src/decorators/tracer/reporters/ConsoleReporter'

let fnSpy

describe('Tracer', () => {
  beforeEach(() => {
    fnSpy = sinon.spy()

    sinon.spy(ConsoleReporter.prototype, 'send')
  })

  afterEach(() => {
    fnSpy.resetHistory()

    ConsoleReporter.prototype.send.restore()
  })

  it('Should exist', () => {
    expect(tracer).to.be.a('function')
  })

  it('Should call the original function', () => {
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction() {
        fnSpy()

        return false
      }
    }

    const testFnInstance = new TestFunction()

    testFnInstance.tryFunction()

    expect(fnSpy.calledOnce).to.be.true
  })

  it('Should return the original function value', () => {
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction() {
        return 'test return value'
      }
    }

    const testFnInstance = new TestFunction()
    const testFunctionReturnedValue = testFnInstance.tryFunction()

    expect(testFunctionReturnedValue).to.be.equal('test return value')
  })

  it('Should preserve the original function context', () => {
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction() {
        return this
      }
    }

    const testFnInstance = new TestFunction()
    const testFunctionReturnedValue = testFnInstance.tryFunction()

    expect(testFunctionReturnedValue).to.be.instanceOf(TestFunction)
  })

  it('Should pass the original function arguments', () => {
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction({p1, p2}) {
        return p1 + p2
      }
    }

    const testFnInstance = new TestFunction()
    const testFunctionReturnedValue = testFnInstance.tryFunction({
      p1: 'Hola',
      p2: ' mundo'
    })

    expect(testFunctionReturnedValue).to.be.equal('Hola mundo')
  })

  it('Should work with asynchronous functions and check promise resolve returns expected value', async () => {
    const timeout = 10
    const resolveValue = 'ok response'
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction() {
        return new Promise(resolve => {
          setTimeout(() => resolve(resolveValue), timeout)
        })
      }
    }

    const testFnInstance = new TestFunction()
    const testFunctionReturnedValue = testFnInstance.tryFunction()

    expect(testFunctionReturnedValue).to.be.instanceOf(Promise)

    const promiseResolve = await testFunctionReturnedValue
    expect(promiseResolve).to.be.equal(resolveValue)
  })

  it('Should work with asynchronous functions and check promise reject returns expected value', async () => {
    const timeout = 10
    const rejectValue = 'ko response'
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction() {
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(rejectValue), timeout)
        })
      }
    }

    const testFnInstance = new TestFunction()
    const testFunctionReturnedValue = testFnInstance.tryFunction()

    expect(testFunctionReturnedValue).to.be.instanceOf(Promise)
    let expected
    try {
      await testFunctionReturnedValue
    } catch (error) {
      expected = error
    }
    expect(expected).to.be.equal(rejectValue)
  })

  it('Should call console reporter on function success', async () => {
    const timeout = 10
    const resolveResponse = 'ok response'
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction() {
        return new Promise(resolve => {
          setTimeout(() => resolve(resolveResponse), timeout)
        })
      }
    }

    const testFnInstance = new TestFunction()
    await testFnInstance.tryFunction()

    expect(ConsoleReporter.prototype.send.called).to.be.true
  })

  it('Should call console reporter when function fails', async () => {
    const timeout = 10
    const failResponse = 'ko response'
    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      tryFunction() {
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(failResponse), timeout)
        })
      }
    }

    const testFnInstance = new TestFunction()
    let expected

    try {
      await testFnInstance.tryFunction()
    } catch (error) {
      expected = error
    }
    expect(expected).to.be.equal(failResponse)
    expect(ConsoleReporter.prototype.send.called).to.be.true
  })

  it('Should call console reporter when function succeeds and has inlineError decorator', async () => {
    const timeout = 10
    const resolveResponse = 'ok response'

    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      @inlineError
      tryFunction() {
        return new Promise(resolve => {
          setTimeout(() => resolve(resolveResponse), timeout)
        })
      }
    }

    const testFnInstance = new TestFunction()
    const [, result] = await testFnInstance.tryFunction()

    expect(result).to.be.equal(resolveResponse)
    expect(ConsoleReporter.prototype.send.called).to.be.true
  })

  it('Should call console reporter when function fails and has inlineError decorator', async () => {
    const timeout = 10
    const failResponse = 'ko response'

    class TestFunction {
      @tracer({metric: 'METRIC_1'})
      @inlineError
      tryFunction() {
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(failResponse), timeout)
        })
      }
    }

    const testFnInstance = new TestFunction()
    const [error] = await testFnInstance.tryFunction()

    expect(error).to.be.equal(failResponse)
    expect(ConsoleReporter.prototype.send.called).to.be.true
  })

  it('Should use class and method as metric name if no metric arg is specified', async () => {
    const timeout = 10
    const resolveResponse = 'ok response'

    class TestFunction {
      @tracer()
      @inlineError
      tryFunction() {
        return new Promise(resolve => {
          setTimeout(() => resolve(resolveResponse), timeout)
        })
      }
    }

    const testFnInstance = new TestFunction()
    const [, result] = await testFnInstance.tryFunction()

    expect(result).to.be.equal(resolveResponse)
    expect(ConsoleReporter.prototype.send.called).to.be.true
  })
})

import {expect} from 'chai'
import sinon from 'sinon'

import {Deprecated} from '../../src/decorators/deprecated/index.js'

describe('Deprecated decorator', () => {
  beforeEach(() => {
    sinon.stub(console, 'warn')
    window.__SUI_DECORATOR_DEPRECATED_REPORTER__ = undefined
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should exist', () => {
    expect(Deprecated).to.exist
    expect(Deprecated).to.be.a('function')
  })

  it('should write a console.warn into console', async () => {
    class Buzz {
      @Deprecated({key: 'returnASuccessPromise', message: 'This method is deprecated'})
      returnASuccessPromise() {
        return Promise.resolve(true)
      }
    }

    const buzz = new Buzz()
    expect(await buzz.returnASuccessPromise()).to.be.eql(true)
    expect(console.warn.calledOnce).to.be.true
  })

  it('should call to listener', async () => {
    window.__SUI_DECORATOR_DEPRECATED_REPORTER__ = sinon.spy()

    class Buzz {
      @Deprecated({key: 'returnASuccessPromise', message: 'This method is deprecated'})
      returnASuccessPromise() {
        return Promise.resolve(true)
      }
    }

    const buzz = new Buzz()
    expect(await buzz.returnASuccessPromise()).to.be.eql(true)
    expect(window.__SUI_DECORATOR_DEPRECATED_REPORTER__.calledOnce).to.be.true
  })
})

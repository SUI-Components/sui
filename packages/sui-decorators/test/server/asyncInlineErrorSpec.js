import {expect} from 'chai'

import {AsyncInlineError} from '../../src/index.js'

describe('AsyncInlineError decorator', () => {
  it('should exist', () => {
    expect(AsyncInlineError).to.exist
    expect(AsyncInlineError).to.be.a('function')
  })

  it('should return an array [null, resp] when the promise is resolved', async () => {
    class Buzz {
      @AsyncInlineError()
      returnASuccessPromise() {
        return Promise.resolve(true)
      }
    }
    const buzz = new Buzz()
    expect(await buzz.returnASuccessPromise()).to.be.eql([null, true])
  })

  it('should return an array [Error, null] when the promise is rejected', async () => {
    class Buzz {
      @AsyncInlineError()
      returnAFailedPromise() {
        return Promise.reject(new Error('Error Rejected'))
      }
    }
    const buzz = new Buzz()

    const [err, resp] = await buzz.returnAFailedPromise()
    expect(resp).to.be.eql(null)
    expect(err).to.be.an.instanceof(Error)
    expect(err.message).to.be.eql('Error Rejected')
  })

  it('should preserve the context', async () => {
    class Buzz {
      name = 'Carlos'

      @AsyncInlineError()
      returnASuccessPromise() {
        return Promise.resolve(this.name)
      }
    }
    const buzz = new Buzz()
    expect(await buzz.returnASuccessPromise()).to.be.eql([null, 'Carlos'])
  })

  it('should works with an Error subclass', async () => {
    class CustomError extends Error {}
    class Buzz {
      @AsyncInlineError()
      returnAFailedPromise() {
        return Promise.reject(new CustomError('Error Rejected'))
      }
    }
    const buzz = new Buzz()

    const [err, resp] = await buzz.returnAFailedPromise()
    expect(resp).to.be.eql(null)
    expect(err).to.be.an.instanceof(CustomError)
    expect(err.message).to.be.eql('Error Rejected')
  })

  it('should fail when the decorator is used in a non-async function', () => {
    expect(() => {
      class Buzz {
        @AsyncInlineError()
        execute() {
          return true
        }
      }
      const buzz = new Buzz()
      buzz.execute()
    }).to.throw('You might decorate an async function with use @AsyncInlineError')
  })

  it('should fail when the decorated method throws an error', async () => {
    class Buzz {
      @AsyncInlineError()
      throwAnException() {
        throw new Error('Error exception')
      }
    }
    const buzz = new Buzz()

    expect(() => {
      buzz.throwAnException()
    }).to.throw('You might decorate an async function with use @AsyncInlineError')
  })
})

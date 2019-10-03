/* eslint-disable no-unused-expressions */
import {expect} from 'chai'

import {inlineError, streamify} from '../../src'

describe('Error', () => {
  it('Should play fine with streamify when is OK the response', done => {
    @streamify('execute')
    class Buzz {
      @inlineError
      async execute() {
        return 'This is fine!'
      }
    }

    const buzz = new Buzz()
    buzz.$.execute.subscribe(({params, result}) => {
      expect(result).to.be.eql('This is fine!')
    })

    buzz.execute().then(([err, resp]) => {
      expect(err).to.be.null
      expect(resp).to.be.eql('This is fine!')
      done()
    })
  })
  it('Should play fine with streamify when is KO the response', done => {
    @streamify('execute')
    class Buzz {
      @inlineError
      async execute() {
        return Promise.reject(new Error('KO'))
      }
    }

    const buzz = new Buzz()
    buzz.$.execute.subscribe('', ({params, error}) => {
      expect(error).to.be.an.instanceof(Error)
      expect(error.message).to.be.eql('KO')
    })

    buzz.execute().then(([err, resp]) => {
      expect(resp).to.be.eql(null)
      expect(err).to.be.an.instanceof(Error)
      expect(err.message).to.be.eql('KO')
      done()
    })
  })
  it('Should return an array [null, resp] when the promise is resolved', async () => {
    class Buzz {
      @inlineError
      returnASuccessPromise() {
        return Promise.resolve(true)
      }
    }
    const buzz = new Buzz()
    expect(await buzz.returnASuccessPromise()).to.be.eql([null, true])
  })

  it('Should return an array [Error, null] when the promise is rejected', async () => {
    class Buzz {
      @inlineError
      returnAFailedPromise() {
        return Promise.reject(new Error('Error Rejected'))
      }

      @inlineError
      throwAnException() {
        throw new Error('Error exception')
      }
    }
    const buzz = new Buzz()

    const [err, resp] = await buzz.returnAFailedPromise()
    expect(resp).to.be.eql(null)
    expect(err).to.be.an.instanceof(Error)
    expect(err.message).to.be.eql('Error Rejected')

    const [errEx, respEx] = await buzz.throwAnException()
    expect(respEx).to.be.eql(null)
    expect(errEx).to.be.an.instanceof(Error)
    expect(errEx.message).to.be.eql('Error exception')
  })

  it('Should preserv the context', async () => {
    class Buzz {
      name = 'Carlos'
      @inlineError
      returnASuccessPromise() {
        return Promise.resolve(this.name)
      }
    }
    const buzz = new Buzz()
    expect(await buzz.returnASuccessPromise()).to.be.eql([null, 'Carlos'])
  })

  it('Should works with sync method', async () => {
    class Buzz {
      name = 'Carlos'
      @inlineError
      isASyncMethodSuccess() {
        return this.name
      }
    }
    const buzz = new Buzz()
    expect(await buzz.isASyncMethodSuccess()).to.be.eql([null, 'Carlos'])
  })

  it('Should works with sync method thowing an Error', async () => {
    class Buzz {
      name = 'Carlos'
      @inlineError
      isASyncMethodFailed() {
        throw new Error(this.name)
      }
    }
    const buzz = new Buzz()
    const [err, resp] = await buzz.isASyncMethodFailed()
    expect(resp).to.be.eql(null)
    expect(err).to.be.an.instanceof(Error)
    expect(err.message).to.be.eql('Carlos')
  })

  it('Should works with an Error subclass', async () => {
    class CustomError extends Error {}
    class Buzz {
      @inlineError
      returnAFailedPromise() {
        return Promise.reject(new CustomError('Error Rejected'))
      }

      @inlineError
      throwAnException() {
        throw new CustomError('Error exception')
      }
    }
    const buzz = new Buzz()

    const [err, resp] = await buzz.returnAFailedPromise()
    expect(resp).to.be.eql(null)
    expect(err).to.be.an.instanceof(CustomError)
    expect(err.message).to.be.eql('Error Rejected')

    const [errEx, respEx] = await buzz.throwAnException()
    expect(respEx).to.be.eql(null)
    expect(errEx).to.be.an.instanceof(CustomError)
    expect(errEx.message).to.be.eql('Error exception')
  })
})

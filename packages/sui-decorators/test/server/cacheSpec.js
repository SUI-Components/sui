/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import {expect} from 'chai'

import cache from '../../src/decorators/cache'
import inlineError from '../../src/decorators/error'

describe('Cache in the server', () => {
  describe('decorating a sync method', () => {
    it('should not apply cache in Node by default', () => {
      class Buzz {
        constructor() {
          this.rnd = () => Math.random()
        }

        @cache()
        @inlineError
        syncRndNumber() {
          return this.rnd()
        }
      }
      const buzz = new Buzz()
      expect(buzz.syncRndNumber()).to.be.not.eql(buzz.syncRndNumber())
    })

    it('should apply cache if server param is true for different instances', () => {
      class Buzz1 {
        constructor() {
          this.rnd = () => Math.random()
        }

        @cache({server: true})
        syncRndNumber() {
          const rnd = this.rnd()
          return rnd
        }
      }
      const buzz11 = new Buzz1()
      const buzz12 = new Buzz1()

      expect(buzz11.syncRndNumber()).to.be.eql(buzz12.syncRndNumber())
    })

    it('with inlineError should apply cache if server param is true', () => {
      class Buzz2 {
        constructor() {
          this.rnd = () => Math.random()
        }

        @cache({server: true})
        @inlineError
        syncRndNumber() {
          return this.rnd()
        }
      }
      const buzz2 = new Buzz2()
      expect(buzz2.syncRndNumber()).to.be.eql(buzz2.syncRndNumber())
    })

    it('should not apply cache for inlineError decorated error response', () => {
      let shouldReturnError = true

      class Yummy {
        @cache({server: true})
        @inlineError
        rndNumber() {
          if (shouldReturnError) {
            throw new Error('Error')
          }

          return Math.random()
        }
      }

      const yummy = new Yummy()
      const responseFirst = yummy.rndNumber()
      shouldReturnError = false
      const responseSecond = yummy.rndNumber()
      const responseThird = yummy.rndNumber()

      expect(responseFirst[0]).to.be.not.null
      expect(responseSecond[1]).to.be.eql(responseThird[1])
    })
  })

  describe('decorating an async method', () => {
    it('should return twice the same random number without params', done => {
      class Dummy {
        @cache({server: true})
        @inlineError
        asyncRndNumber() {
          return new Promise(resolve => setTimeout(resolve, 100, Math.random()))
        }
      }
      const dummy = new Dummy()
      Promise.all([dummy.asyncRndNumber(), dummy.asyncRndNumber()]).then(
        ([firstCall, secondCall]) => {
          expect(firstCall).to.be.eql(secondCall)
          done()
        }
      )
    })

    it('should not apply cache for inlineError decorated error response and cache ok response', async () => {
      let shouldReturnError = true
      class YummyAsyncInMemory {
        @cache({
          server: true,
          ttl: '1 minute'
        })
        @inlineError
        async asyncRndNumber() {
          if (shouldReturnError) {
            return Promise.reject(new Error('Error'))
          }

          return Math.random()
        }
      }

      const yummyAsync = new YummyAsyncInMemory()
      // Error response, it should not be cached
      const responseFirst = await yummyAsync.asyncRndNumber()

      // Ok response, it should be cached
      shouldReturnError = false
      const responseSecond = await yummyAsync.asyncRndNumber()
      const responseThird = await yummyAsync.asyncRndNumber()

      // Here we force an error and expect not response error because it is cached
      shouldReturnError = true
      const responseFourth = await yummyAsync.asyncRndNumber()

      expect(responseFirst[0]).to.be.not.null
      expect(responseSecond[1]).to.be.eql(responseThird[1])
      expect(responseFourth[0]).to.be.null
      expect(responseSecond[1]).to.be.eql(responseFourth[1])
    })

    it('with cacheKeyString param defined should return twice the same random number without params', done => {
      class Dummy2 {
        @cache({server: true, cacheKeyString: 'Dummy2#asyncRndNumber'})
        @inlineError
        asyncRndNumber() {
          return new Promise(resolve => setTimeout(resolve, 100, Math.random()))
        }
      }
      const dummy = new Dummy2()
      Promise.all([dummy.asyncRndNumber(), dummy.asyncRndNumber()]).then(
        ([firstCall, secondCall]) => {
          expect(firstCall).to.be.eql(secondCall)
          done()
        }
      )
    })
  })

  describe('redis cache', () => {
    const useRedis = process.env.USE_REDIS_IN_SUI_DECORATORS_CACHE
    let redis
    if (useRedis) {
      redis = require('redis').createClient(6379, 'localhost')
      redis.on('error', () => {
        redis = null
      })
    } else {
      redis = require('redis-mock').createClient()
    }

    beforeEach(done => {
      if (!redis) {
        return done()
      }
      redis.flushdb(() => done())
    })

    it('should apply cache for ok simple random number response and not apply cache for inlineError decorated error response', async () => {
      let shouldReturnError = true

      class YummyAsyncInRedis {
        @cache({
          server: true,
          ttl: '1 minute',
          redis: {host: 'localhost', port: 6379}
        })
        @inlineError
        async asyncRndNumber() {
          if (shouldReturnError) {
            return Promise.reject(new Error('Error'))
          }

          return Math.random()
        }
      }

      const yummyAsync = new YummyAsyncInRedis()
      // Error response, it should not be cached
      const responseFirst = await yummyAsync.asyncRndNumber()

      // Ok response, it should be cached
      shouldReturnError = false
      const responseSecond = await yummyAsync.asyncRndNumber()
      const responseThird = await yummyAsync.asyncRndNumber()

      // Here we force an error and expect not response error because it is cached
      shouldReturnError = true
      const responseFourth = await yummyAsync.asyncRndNumber()

      expect(responseFirst[0]).to.be.not.null
      expect(responseSecond[1]).to.be.eql(responseThird[1])
      expect(responseFourth[0]).to.be.null
      expect(responseSecond[1]).to.be.eql(responseFourth[1])
    })

    it('should apply cache for a complex json response and not apply cache for inlineError decorated error response', async () => {
      let shouldReturnError = true

      class YummyAsync {
        @cache({
          server: true,
          ttl: '1 minute',
          redis: {host: 'localhost', port: 6379}
        })
        @inlineError
        async asyncRndObject() {
          if (shouldReturnError) {
            return Promise.reject(new Error('Error'))
          }

          return {
            name: 'YummyAsync',
            randomNumbersList: [Math.random(), Math.random(), Math.random()],
            boolValue: true,
            date: Date.now()
          }
        }
      }

      const yummyAsync = new YummyAsync()
      // Error response, it should not be cached
      const responseFirst = await yummyAsync.asyncRndObject()

      // Ok response, it should be cached
      shouldReturnError = false
      const responseSecond = await yummyAsync.asyncRndObject()
      const responseThird = await yummyAsync.asyncRndObject()

      // Here we force an error and expect not response error because it is cached
      shouldReturnError = true
      const responseFourth = await yummyAsync.asyncRndObject()

      expect(responseFirst[0]).to.be.not.null
      expect(responseSecond[1]).to.be.eql(responseThird[1])
      expect(responseFourth[0]).to.be.null
      expect(responseSecond[1]).to.be.eql(responseFourth[1])
    })

    it('should not apply cache for expired ttl complex json response', done => {
      class YummyAsync {
        @cache({
          server: true,
          ttl: 100,
          redis: {host: 'localhost', port: 6379}
        })
        @inlineError
        async asyncRndObjectWithTTL() {
          return {
            name: 'YummyAsync',
            randomNumbersList: [Math.random(), Math.random(), Math.random()],
            boolValue: true,
            date: Date.now()
          }
        }
      }

      const yummyAsync = new YummyAsync()
      yummyAsync.asyncRndObjectWithTTL().then(firstResponse => {
        setTimeout(() => {
          yummyAsync.asyncRndObjectWithTTL().then(secondResponse => {
            expect(firstResponse[0]).to.be.null
            expect(secondResponse[0]).to.be.null
            expect(firstResponse[1]).to.be.not.eql(secondResponse[1])
          })
          done()
        }, 110)
      })
    })

    it('with cacheKeyString param defined it should apply cache for ok simple random number response and not apply cache for inlineError decorated error response', async () => {
      let shouldReturnError = true

      class YummyAsync2 {
        @cache({
          server: true,
          ttl: '1 minute',
          redis: {host: 'localhost', port: 6379},
          cacheKeyString: 'YummyAsync2#asyncRndNumber'
        })
        @inlineError
        async asyncRndNumber() {
          if (shouldReturnError) {
            return Promise.reject(new Error('Error'))
          }

          return Math.random()
        }
      }

      const yummyAsync = new YummyAsync2()
      // Error response, it should not be cached
      const responseFirst = await yummyAsync.asyncRndNumber()

      // Ok response, it should be cached
      shouldReturnError = false
      const responseSecond = await yummyAsync.asyncRndNumber()
      const responseThird = await yummyAsync.asyncRndNumber()

      // Here we force an error and expect not response error because it is cached
      shouldReturnError = true
      const responseFourth = await yummyAsync.asyncRndNumber()

      expect(responseFirst[0]).to.be.not.null
      expect(responseSecond[1]).to.be.eql(responseThird[1])
      expect(responseFourth[0]).to.be.null
      expect(responseSecond[1]).to.be.eql(responseFourth[1])
    })
  })
})

/* eslint-disable no-return-assign, no-unused-expressions */
import sinon from 'sinon'
import {expect} from 'chai'

import cache from '../../src/decorators/cache'
import inlineError from '../../src/decorators/error'

describe('Cache in browser', () => {
  it('Should exist', () => {
    expect(cache).to.be.a('function')
  })

  describe('should be able use others method in this instance', () => {
    it('return the response of other instance´s method', () => {
      class Buz {
        constructor() {
          this.rnd = () => Math.random()
        }

        @cache()
        @inlineError
        syncRndNumber() {
          return this.rnd()
        }
      }
      const buz = new Buz()
      const firstCall = buz.syncRndNumber()
      const sencondCall = buz.syncRndNumber()
      expect(firstCall).to.be.eql(sencondCall)
    })
  })

  describe('should be able to decorate several classes with different TTLs', () => {
    let clock = null
    beforeEach(() => (clock = sinon.useFakeTimers()))
    afterEach(() => clock.restore())

    it('return same value for long TTL and different for short TTL', () => {
      class Foo {
        @cache()
        syncRndNumber() {
          return Math.random()
        }
      }

      class Bar {
        @cache({ttl: 700})
        syncRndNumber() {
          return Math.random()
        }
      }
      const foo = new Foo()
      const bar = new Bar()
      const firstFooCall = foo.syncRndNumber()
      const firstBarCall = bar.syncRndNumber()
      clock.tick(600)
      const secondFooCall = foo.syncRndNumber()
      const secondBarCall = bar.syncRndNumber()

      expect(firstFooCall).to.be.not.eql(secondFooCall)
      expect(firstBarCall).to.be.eql(secondBarCall)
    })
  })

  describe('should decorate an async method', () => {
    it('return twice the same random number without params', done => {
      class Dummy {
        @cache()
        @inlineError
        asyncRndNumber(num) {
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

    it('return different numbers if the promise fails', done => {
      let fail = true // Un poco cogido por los pelos
      class Dummy {
        @cache()
        @inlineError
        asyncRndNumber(num) {
          const prms = !fail
            ? new Promise((resolve, reject) =>
                setTimeout(resolve, 100, Math.random())
              )
            : new Promise((resolve, reject) =>
                setTimeout(reject, 100, Math.random())
              )
          fail = !fail
          return prms
        }
      }
      const dummy = new Dummy()
      dummy.asyncRndNumber(12).then(firstCall => {
        dummy.asyncRndNumber(12).then(secondCall => {
          expect(firstCall).to.be.not.eql(secondCall)
          done()
        })
      })
    })
  })

  describe('should decorate a sync method', () => {
    it('return twice time the same random number without params', () => {
      class Dummy {
        @cache()
        syncRndNumber(num) {
          return Math.random()
        }
      }
      const dummy = new Dummy()
      expect(dummy.syncRndNumber()).to.be.eql(dummy.syncRndNumber())
    })

    it('return different numbers with different params', () => {
      class Dummy {
        @cache()
        syncRndNumber(num) {
          return Math.random()
        }
      }
      const dummy = new Dummy()
      expect(dummy.syncRndNumber(1)).to.be.not.eql(dummy.syncRndNumber(2))
    })

    it('return same numbers with same params', () => {
      class Dummy {
        @cache()
        syncRndNumber(num) {
          return Math.random()
        }
      }
      const dummy = new Dummy()
      expect(dummy.syncRndNumber(1, 2)).to.be.eql(dummy.syncRndNumber(1, 2))
      expect(dummy.syncRndNumber({a: 'b'})).to.be.eql(
        dummy.syncRndNumber({a: 'b'})
      )
    })

    describe('have a TTL for each key', () => {
      let clock = null
      beforeEach(() => (clock = sinon.useFakeTimers()))
      afterEach(() => clock.restore())
      it('cancel the cache after ttl ms', () => {
        class Dummy {
          @cache() // 500ms by default
          syncRndNumber(num) {
            return Math.random()
          }
        }
        const dummy = new Dummy()
        const firstCall = dummy.syncRndNumber(123)
        clock.tick(600)
        expect(dummy.syncRndNumber(123)).to.be.not.eql(firstCall)
      })

      it('remain the cache before ttl ms', () => {
        class Dummy {
          @cache() // 500ms by default
          syncRndNumber(num) {
            return Math.random()
          }
        }
        const dummy = new Dummy()
        const firstCall = dummy.syncRndNumber(1234)
        clock.tick(400)
        expect(dummy.syncRndNumber(1234)).to.be.eql(firstCall)
      })

      it('remain the cache before not default ttl ms', () => {
        class Dummy {
          @cache({ttl: 700})
          syncRndNumber(num) {
            return Math.random()
          }
        }
        const dummy = new Dummy()
        const firstCall = dummy.syncRndNumber(1234)
        clock.tick(600)
        expect(dummy.syncRndNumber(1234)).to.be.eql(firstCall)
      })

      describe('Should be able setting the TTL using a string', () => {
        it('return the same value when you call faster', () => {
          class Biz {
            constructor() {
              this.rnd = () => Math.random()
            }

            @cache({ttl: '2 minutes'})
            syncRndNumber(num) {
              return this.rnd()
            }
          }

          const biz = new Biz()
          const firstCall = biz.syncRndNumber(1234)
          clock.tick(1000 * 60) // 1 minute
          expect(biz.syncRndNumber(1234)).to.be.eql(firstCall)
        })

        it('use the default TTL for unknown string', () => {
          class Biz {
            constructor() {
              this.rnd = () => Math.random()
            }

            @cache({ttl: 'pepito'})
            syncRndNumber(num) {
              return this.rnd()
            }
          }

          const biz = new Biz()
          const firstCall = biz.syncRndNumber(12)
          clock.tick(1000 * 60) // 1 minute
          expect(biz.syncRndNumber(12)).to.be.not.eql(firstCall)
        })
      })
    })
  })

  describe('redis cache should not apply in client', () => {
    it('should apply inMemory cache for ok simple random number response and not apply cache for inlineError decorated error response', async () => {
      let shouldReturnError = true

      class YummyAsync {
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

      const yummyAsync = new YummyAsync()
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

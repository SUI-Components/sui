/* eslint-disable no-return-assign, no-unused-expressions */
import sinon from 'sinon'
import {expect} from 'chai'

import cache from '../../src/decorators/cache'
import BrowserTracker from '../../src/decorators/cache/tracker/BrowserTracker'

describe('Cache', () => {
  it('Should exist', () => {
    expect(cache).to.be.a('function')
  })

  describe('should be able use others method in this instance', () => {
    it('return the response of other instance´s method', () => {
      class Buz {
        constructor () {
          this.rnd = () => Math.random()
        }

        @cache()
        syncRndNumber (num) {
          return this.rnd()
        }
      }
      const buz = new Buz()
      expect(buz.syncRndNumber()).to.be.eql(buz.syncRndNumber())
    })
  })

  describe('should be able to decorate several classes with different TTLs', () => {
    let clock = null
    beforeEach(() => (clock = sinon.useFakeTimers()))
    afterEach(() => clock.restore())

    it('return same value for long TTL and different for short TTL', () => {
      class Foo {
        @cache()
        syncRndNumber (num) {
          return Math.random()
        }
      }

      class Bar {
        @cache({ttl: 700})
        syncRndNumber (num) {
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
        asyncRndNumber (num) {
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

    it('return different numbers if the promise fails', done => {
      let fail = true // Un poco cogido por los pelos
      class Dummy {
        @cache()
        asyncRndNumber (num) {
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
      dummy.asyncRndNumber(12).catch(firstCall => {
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
        syncRndNumber (num) {
          return Math.random()
        }
      }
      const dummy = new Dummy()
      expect(dummy.syncRndNumber()).to.be.eql(dummy.syncRndNumber())
    })

    it('return different numbers with different params', () => {
      class Dummy {
        @cache()
        syncRndNumber (num) {
          return Math.random()
        }
      }
      const dummy = new Dummy()
      expect(dummy.syncRndNumber(1)).to.be.not.eql(dummy.syncRndNumber(2))
    })

    it('return same numbers with same params', () => {
      class Dummy {
        @cache()
        syncRndNumber (num) {
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
          syncRndNumber (num) {
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
          syncRndNumber (num) {
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
          syncRndNumber (num) {
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
            constructor () {
              this.rnd = () => Math.random()
            }

            @cache({ttl: '2 minutes'})
            syncRndNumber (num) {
              return this.rnd()
            }
          }

          const biz = new Biz()
          const firstCall = biz.syncRndNumber(1234)
          clock.tick(1000 * 60) // 1 minute
          expect(biz.syncRndNumber(1234)).to.be.eql(firstCall)
        })

        it('use the default TTL for unkonw string', () => {
          class Biz {
            constructor () {
              this.rnd = () => Math.random()
            }

            @cache({ttl: 'pepito'})
            syncRndNumber (num) {
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

    describe('Tracking hit and miss in the browser', () => {
      let _sendSpy, clock
      before(() => {
        _sendSpy = sinon.spy(BrowserTracker.prototype, '_send')
        clock = sinon.useFakeTimers()
      })

      after(() => {
        _sendSpy.reset()
        clock.restore()
      })

      it('BrowserTracker must NOT track to the browser', () => {
        class Biz {
          constructor () {
            this.rnd = () => Math.random()
          }

          @cache({trackTo: 'localhost'})
          syncRndNumber (num) {
            return this.rnd()
          }
        }

        const biz = new Biz()
        biz.syncRndNumber(12)
        clock.tick(1000 * 21) // 21 seconds
        biz.syncRndNumber(12)
        expect(_sendSpy.notCalled).to.be.ok
      })
    })
  })
})

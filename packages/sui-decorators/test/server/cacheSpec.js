/* eslint-disable no-unused-expressions */

import sinon from 'sinon'
import {expect} from 'chai'

import cache from '../../src/decorators/cache'
import NodeTracker from '../../src/decorators/cache/tracker/NodeTracker'

describe('Cache', () => {
  it('should ignore the cache in Node by default', () => {
    class Buz {
      constructor() {
        this.rnd = () => Math.random()
      }

      @cache()
      syncRndNumber(num) {
        return this.rnd()
      }
    }
    const buz = new Buz()
    expect(buz.syncRndNumber()).to.be.not.eql(buz.syncRndNumber())
  })

  it('should have a cache if the force the cache in node', () => {
    class Buz {
      constructor() {
        this.rnd = () => Math.random()
      }

      @cache({server: true})
      syncRndNumber(num) {
        return this.rnd()
      }
    }
    const buz = new Buz()
    expect(buz.syncRndNumber()).to.be.eql(buz.syncRndNumber())
  })

  it('return twice the same random number without params', done => {
    class Dummy {
      @cache({server: true})
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

  describe('Tracking hit and miss in the server', () => {
    let _sendSpy, clock
    before(() => {
      _sendSpy = sinon.spy(NodeTracker.prototype, '_send')
      clock = sinon.useFakeTimers()
    })

    after(() => {
      _sendSpy.reset()
      clock.restore()
    })

    it('NodeTracker must NOT track to the server pass 10 seconds from the last track', () => {
      class Biz {
        constructor() {
          this.rnd = () => Math.random()
        }

        @cache({server: true, trackTo: 'localhost'})
        syncRndNumber(num) {
          return this.rnd()
        }
      }

      const biz = new Biz()
      biz.syncRndNumber(12)
      clock.tick(1000 * 10) // 10 seconds
      biz.syncRndNumber(12)
      expect(_sendSpy.notCalled).to.be.ok
    })

    xit('NodeTracker must track to the server pass 20 seconds from the last track', () => {
      class Biz {
        constructor() {
          this.rnd = () => Math.random()
        }

        @cache({server: true, trackTo: 'localhost'})
        syncRndNumber(num) {
          return this.rnd()
        }
      }

      const biz = new Biz()
      biz.syncRndNumber(12)
      clock.tick(1000 * 21) // 21 seconds
      biz.syncRndNumber(12)
      const [arg] = _sendSpy.getCall(0).args
      expect(arg).to.contain.all.keys({
        path: '/__tracking/cache/event/stats'
      })
      expect(JSON.parse(arg.headers['x-payload'])).to.contain.all.keys({
        hits: 1,
        misses: 1,
        env: 'browser',
        algorithm: 'lfu'
      })
    })
  })
})

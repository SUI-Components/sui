/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import {expect} from 'chai'

import cache from '../../src/decorators/cache'

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
})

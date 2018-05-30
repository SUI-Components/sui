/* eslint-disable no-unused-expressions */

import {expect} from 'chai'
import sinon from 'sinon'

import {streamify} from '../../src'

class Dummy {
  constructor(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  throwError() {
    throw new Error('throwError')
  }

  asyncThrowError() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('asyncThrowError')), 0)
    })
  }

  notDecorateMethod(number) {
    return `Called with ${number}`
  }

  dummyMethodPromise(number, multiplicity) {
    return new Promise(resolve => {
      setTimeout(() => resolve(number * multiplicity), 0)
    })
  }

  dummyMethod(number, multiplicity) {
    return number * multiplicity
  }
}

describe('Streamify', () => {
  it('Is a function (decorator)', () => {
    expect(streamify).to.be.a('function')
  })

  describe('Should decorate a class', () => {
    let dummyDecorate
    let subscription

    beforeEach(() => {
      const DummyDecorate = streamify(
        'dummyMethod',
        'dummyMethodPromise',
        'throwError',
        'asyncThrowError'
      )(Dummy)
      dummyDecorate = new DummyDecorate('Carlos')
    })

    afterEach(() => {
      dummyDecorate = null
      if (subscription && subscription.dispose) {
        subscription.dispose()
      }
      subscription = null
    })

    it('subscribe to calls and results for sync method', done => {
      const onNext = ({params, result}) => {
        expect(params).to.be.eql([5, 2])
        expect(result).to.be.eql(10)
        done()
      }

      subscription = dummyDecorate.$.dummyMethod.subscribe(onNext)
      dummyDecorate.dummyMethod(5, 2)
    })

    it('Remaing not decorate methods', () => {
      expect(dummyDecorate.notDecorateMethod(42)).to.be.eql('Called with 42')
    })

    it('Notify sync errors', done => {
      const onError = ({params, error}) => {
        expect(params).to.be.eql([])
        expect(error.message).to.be.eql('throwError')
        done()
      }

      subscription = dummyDecorate.$.throwError.subscribe(
        console.log.bind(console),
        onError,
        console.log.bind(console)
      )

      try {
        dummyDecorate.throwError()
      } catch (e) {}
    })

    xit('Notify Async errors', done => {
      const onError = ({params, error}) => {
        expect(params).to.be.eql([])
        expect(error).to.be.eql(new Error('asyncThrowError'))
        done()
      }

      subscription = dummyDecorate.$.asyncThrowError.subscribe(
        console.log.bind(console),
        onError,
        console.log.bind(console)
      )

      dummyDecorate.asyncThrowError()
    })

    it('subscribe to calls and results for Async method', done => {
      const onNext = ({params, result}) => {
        expect(params).to.be.eql([10, 2])
        expect(result).to.be.eql(20)
        done()
      }

      subscription = dummyDecorate.$.dummyMethodPromise.subscribe(onNext)
      dummyDecorate.dummyMethodPromise(10, 2)
    })

    it('deal with more than one subscription to sync method', done => {
      const onNext = sinon.spy()
      const sub1 = dummyDecorate.$.dummyMethod.subscribe(onNext)
      const sub2 = dummyDecorate.$.dummyMethod.subscribe(onNext)
      const sub3 = dummyDecorate.$.dummyMethod.subscribe(onNext)

      dummyDecorate.dummyMethod(10, 2)

      // clean subscriptions
      sub1.dispose()
      sub2.dispose()
      sub3.dispose()

      expect(onNext.calledThrice).to.be.true
      done()
    })

    it('deal with more than one subscription to async method', done => {
      const onNext = sinon.spy()
      const sub1 = dummyDecorate.$.dummyMethodPromise.subscribe(onNext)
      const sub2 = dummyDecorate.$.dummyMethodPromise.subscribe(onNext)
      const sub3 = dummyDecorate.$.dummyMethodPromise.subscribe(onNext)

      dummyDecorate.dummyMethodPromise(10, 2).then(() => {
        // clean subscriptions
        sub1.dispose()
        sub2.dispose()
        sub3.dispose()

        expect(onNext.calledThrice).to.be.true
        done()
      })
    })

    it('by default onError call console.error', done => {
      const consoleSpy = sinon.spy(console, 'error')
      const subscription = dummyDecorate.$.throwError.subscribe()

      try {
        dummyDecorate.throwError()
      } catch (e) {
        expect(consoleSpy.calledOnce).to.be.true
        consoleSpy.restore()
        subscription.dispose()
        done()
      }
    })

    describe('dispose', () => {
      it('unsubscribe to calls and results for Async method', done => {
        const onNext = sinon.spy()
        const subscription = dummyDecorate.$.dummyMethodPromise.subscribe(
          onNext
        )
        // unsubscribe immediately to check onNext is not called
        subscription.dispose()

        dummyDecorate.dummyMethodPromise(10, 2).then(() => {
          expect(onNext.called).to.be.false
          done()
        })
      })

      it('unsubscribe to calls and results for sync method', done => {
        const onNext = sinon.spy()
        const subscription = dummyDecorate.$.dummyMethod.subscribe(onNext)
        subscription.dispose()

        dummyDecorate.dummyMethod(10, 2)

        expect(onNext.called).to.be.false
        done()
      })
    })
  })
})

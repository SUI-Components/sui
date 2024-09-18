import {expect} from 'chai'
import sinon from 'sinon'

import {checkAnonymousId} from '../src/checkAnonymousId.js'

describe('checkAnonymousId', () => {
  let anonymousId
  let setAnonymousId

  beforeEach(() => {
    anonymousId = sinon.stub()
    setAnonymousId = sinon.stub()

    window.analytics = {
      user: () => ({
        anonymousId
      }),
      setAnonymousId
    }
  })

  afterEach(() => {
    window.analytics = undefined
  })

  it('should check anonymous id and not reset it when the value is not anonymous_user', () => {
    anonymousId.returns('22564340c4-440a-4bbe-aef8-d9cwd6de1')

    checkAnonymousId()

    expect(anonymousId.callCount).to.equal(1)
    expect(setAnonymousId.callCount).to.equal(0)
  })

  it('should check anonymous id and reset it when the value is anonymous_user', () => {
    anonymousId.returns('anonymous_user')

    checkAnonymousId()

    expect(anonymousId.callCount).to.equal(1)
    expect(setAnonymousId.calledWith(null)).to.be.true
  })
})

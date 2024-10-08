import {expect} from 'chai'
import sinon from 'sinon'

import {HTTPSender} from '../src/Sender/HTTPSender'

describe('HTTPSender', function () {
  beforeEach(function () {
    // https://stackoverflow.com/a/47432826
    this.requestStub = sinon.stub(HTTPSender.prototype, 'request' as any)
    this.logStub = sinon.stub(HTTPSender.prototype, 'log' as any)
    this.clockStub = sinon.useFakeTimers({shouldClearNativeTimers: true})
  })

  afterEach(function () {
    this.requestStub.restore()
    this.logStub.restore()
    this.clockStub.restore()
  })

  it('Should send the proper a JS payload to the API', async function () {
    // Given
    this.requestStub.returns(Promise.resolve(true))
    process.env.GITHUB_REPOSITORY_ID = 1
    const signal = {
      type: 'js',
      numberOfFails: 10,
      ruleName: 'sui/factory-pattern',
      repository: 'ma--frontend'
    } as const

    // When
    await HTTPSender.create().send([signal])

    const JSONExpected = {
      rule: signal.ruleName,
      type: 'js',
      value: signal.numberOfFails
    }

    expect(this.requestStub.calledOnceWith([JSONExpected])).to.be.true
    expect(this.logStub.calledTwice).to.be.true
  })

  it('Should send the proper a Repository payload to the API', async function () {
    // Given
    this.requestStub.returns(Promise.resolve(true))
    process.env.GITHUB_REPOSITORY_ID = 1
    const signal = {
      type: 'repository',
      numberOfFails: 10,
      rule: 'sui/typescript',
      value: false,
      repository: 'ma-frontend'
    } as const

    // When
    await HTTPSender.create().send([signal])

    const JSONExpected = {
      rule: signal.rule,
      value: signal.value,
      type: 'repository'
    }

    expect(this.requestStub.calledOnceWith([JSONExpected])).to.be.true
    expect(this.logStub.calledTwice).to.be.true
  })

  it('Should try one time after a 1sec if fails the frist try', async function () {
    // Given
    this.requestStub.onFirstCall().returns(Promise.resolve(false))
    this.requestStub.onSecondCall().returns(Promise.resolve(true))
    process.env.GITHUB_REPOSITORY_ID = 1
    const signal = {
      type: 'repository',
      numberOfFails: 10,
      rule: 'sui/typescript',
      value: false,
      repository: 'ma-frontend'
    } as const

    // When
    const promise = HTTPSender.create().send([signal])

    await this.clockStub.tickAsync(1000)

    await promise

    // Then
    expect(this.requestStub.calledTwice).to.be.true
    expect(this.logStub.callCount).to.be.eql(3)
  })
})

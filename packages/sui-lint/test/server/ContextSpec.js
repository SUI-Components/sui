import {expect} from 'chai'
import {spy, stub} from 'sinon'

import {Context} from '../../src/RepositoryLinter/Context.js'
import {Match} from '../../src/RepositoryLinter/Match.js'

const LEVELS = {
  OFF: 0,
  WARNING: 1,
  ERROR: 2
}

describe('Context', function () {
  beforeEach(function () {
    this.reportSpy = spy(Context.prototype, 'report')
    this.monitoringSpy = spy(Context.prototype, 'monitoring')
    this.runnerStub = {assertion: stub()}
    this.handlerStub = {
      meta: {messages: {badVersion: 'Message for your bad version'}},
      __assertionStub: stub(),
      __missmatchStub: stub(),
      create() {
        return {
          'package.json': this.__assertionStub,
          missmatch: this.__missmatchStub
        }
      }
    }

    this.handlerInnerStub = {
      meta: {messages: {badVersion: 'Message for your bad version', badKey: 'Message for bad {{key}}'}},
      create(context) {
        return {
          'package.json': matches => {
            context.report({messageId: 'badVersion'})
            context.monitoring(true)
          },
          missmatch: key => {
            context.report({messageId: 'badKey', data: {key}})
            context.monitoring(false)
          }
        }
      }
    }

    this.handlerReducerMonitoringStub = {
      meta: {messages: {badVersion: 'Message for your bad version', badKey: 'Message for bad {{key}}'}},
      reduceMonitoring: stub(),
      create(context) {
        return {
          'package.json': matches => {
            context.monitoring(true)
            context.monitoring(false)
          }
        }
      }
    }
  })

  afterEach(function () {
    this.handlerStub.__assertionStub.reset()
    this.handlerStub.__missmatchStub.reset()

    this.monitoringSpy.restore()
    this.reportSpy.restore()

    this.runnerStub.assertion.reset()

    this.handlerReducerMonitoringStub.reduceMonitoring?.reset()
  })

  it('Should call to the assertions in the handler when there is Match', function () {
    // Given
    const emptyMatch = Match.empty()
    this.runnerStub.assertion.returns([emptyMatch])

    // When
    Context.create(LEVELS.WARNING, this.handlerStub, 'tests/node-version', this.runnerStub).run()

    // Then
    expect(this.handlerStub.__assertionStub.firstCall.firstArg).to.be.instanceof(Array)
    expect(this.handlerStub.__assertionStub.firstCall.firstArg[0]).to.be.eql(emptyMatch)
  })

  it('Should call to the missmatch in the handler when there is not Match with the "failing" key', function () {
    // Given
    this.runnerStub.assertion.returns([])

    // When
    Context.create(LEVELS.WARNING, this.handlerStub, 'tests/node-version', this.runnerStub).run()

    // Then
    expect(this.handlerStub.__assertionStub.firstCall).to.be.eql(null)
    expect(this.handlerStub.__missmatchStub.firstCall.firstArg).to.be.eql('package.json')
  })

  it('Should create new monitorings and messages from assertion function', function () {
    // Given
    this.runnerStub.assertion.returns([Match.empty()])

    // When
    Context.create(LEVELS.WARNING, this.handlerInnerStub, 'tests/node-version', this.runnerStub).run()

    // Then
    expect(this.reportSpy.firstCall.firstArg).to.be.eql({messageId: 'badVersion'})
    expect(this.monitoringSpy.firstCall.firstArg).to.be.eql(true)
  })

  it('Should create new monitorings and messages from missmatch function', function () {
    // Given
    this.runnerStub.assertion.returns([])

    // When
    Context.create(LEVELS.WARNING, this.handlerInnerStub, 'tests/node-version', this.runnerStub).run()

    // Then
    expect(this.reportSpy.firstCall.firstArg).to.be.eql({messageId: 'badKey', data: {key: 'package.json'}})
    expect(this.monitoringSpy.firstCall.firstArg).to.be.eql(false)
  })

  it('Should properly format the messages', function () {
    // Given
    this.runnerStub.assertion.returns([])

    // When
    const context = Context.create(LEVELS.WARNING, this.handlerInnerStub, 'tests/node-version', this.runnerStub).run()

    // Then
    expect(context.messages).to.be.eql([
      {
        rule: 'tests/node-version',
        message: 'Message for bad package.json',
        level: 1,
        messageId: 'badKey',
        data: {key: 'package.json'}
      }
    ])
  })

  it('Should properly format the monitoring', function () {
    // Given
    this.runnerStub.assertion.returns([Match.empty()])

    // When
    const context = Context.create(LEVELS.WARNING, this.handlerInnerStub, 'tests/node-version', this.runnerStub).run()

    // Then
    expect(context.signal).to.be.eql({
      rule: 'tests/node-version',
      value: true,
      level: 1
    })
  })

  it('Should require a reduceMonitoring function when there are more than one monitor', function () {
    // Given
    this.runnerStub.assertion.returns([Match.empty()])
    this.handlerReducerMonitoringStub.reduceMonitoring.returns(false)

    // When
    const context = Context.create(
      LEVELS.WARNING,
      this.handlerReducerMonitoringStub,
      'tests/node-version',
      this.runnerStub
    ).run()

    // Then
    expect(context.signal).to.be.eql({
      rule: 'tests/node-version',
      value: false,
      level: 1
    })
    expect(this.handlerReducerMonitoringStub.reduceMonitoring.firstCall.firstArg).to.be.eql([
      {
        assertion: 'package.json',
        rule: 'tests/node-version',
        value: true,
        level: 1
      },
      {
        assertion: 'package.json',
        rule: 'tests/node-version',
        value: false,
        level: 1
      }
    ])
  })

  it('Should throw an exception if the reduceMonitoring function is undefined', function () {
    // Given
    this.runnerStub.assertion.returns([Match.empty()])
    delete this.handlerReducerMonitoringStub.reduceMonitoring

    // When
    const context = Context.create(
      LEVELS.WARNING,
      this.handlerReducerMonitoringStub,
      'tests/node-version',
      this.runnerStub
    ).run()

    // Then
    expect(() => context.signal).to.be.throw(Context.MISSING_REDUCER_MONITORING_MSG)
  })
})

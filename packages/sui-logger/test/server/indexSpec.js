import {expect} from 'chai'
import sinon from 'sinon'

import {initTracker} from '../../src/index.js'
import * as loggerPkg from '../../src/logger.js'
import * as server from '../../src/server.js'

const Mushroom = {
  start: () => {}
}

const Trackers = {
  create: () => {}
}

describe('initTracker', () => {
  let mushroomStub

  beforeEach(() => {
    mushroomStub = sinon.stub(Mushroom, 'start')
  })

  afterEach(() => {
    mushroomStub.restore()
  })

  it('initialize tracker with the expected config', () => {
    initTracker({Mushroom, appName: 'test', version: '1.0.0', config: {foo: 'bar'}})

    expect(mushroomStub.calledOnce).to.equal(true)
    expect(
      mushroomStub.calledWith('test', {
        config: {foo: 'bar'},
        context: {environment: 'test', isServer: 'true', version: '1.0.0', tenant: undefined}
      })
    ).to.equal(true)
  })
  it('initialize tracker with tenant', () => {
    initTracker({Mushroom, appName: 'test', version: '1.0.0', tenant: 'infojobs', config: {foo: 'bar'}})

    expect(mushroomStub.calledOnce).to.equal(true)
    expect(
      mushroomStub.calledWith('test', {
        config: {foo: 'bar'},
        context: {environment: 'test', isServer: 'true', version: '1.0.0', tenant: 'infojobs'}
      })
    ).to.equal(true)
  })
  it('initialize tracker with a defined environment', () => {
    initTracker({
      Mushroom,
      appName: 'test',
      environment: 'production',
      version: '1.0.0',
      config: {}
    })

    expect(mushroomStub.calledOnce).to.equal(true)
    expect(
      mushroomStub.calledWith('test', {
        config: {},
        context: {environment: 'production', isServer: 'true', version: '1.0.0', tenant: undefined}
      })
    ).to.equal(true)
  })
})

describe('logsErrorsMiddleware', () => {
  let logger
  let loggerPkgStub

  before(() => {
    logger = {error: sinon.stub()}
    loggerPkgStub = sinon.stub(loggerPkg, 'default').returns(logger)
  })

  after(() => {
    loggerPkgStub.restore()
  })

  it('log the error and pass execution to next middleware', () => {
    const error = 'Error Message'
    const req = {headers: {}, url: '/'}
    const res = null
    const next = sinon.stub()
    server.logErrorsMiddleware(error, req, res, next)

    expect(logger.error.calledWith(error)).to.equal(true)
    expect(next.calledWith(error)).to.equal(true)
  })
})

describe('createServerLogger', () => {
  let trackerStub
  let TrackersCreateStub

  beforeEach(() => {
    trackerStub = {emit: sinon.stub()}
    TrackersCreateStub = sinon.stub(Trackers, 'create').returns(trackerStub)
  })

  afterEach(() => {
    TrackersCreateStub.restore()
  })

  it('return a method to log messages and errors', () => {
    const {log, error: logError} = loggerPkg.default({Trackers})
    log('logging message')
    logError(new Error('test'))

    const [label, {error}] = trackerStub.emit.getCall(1).args
    expect(label).to.equal('ERROR')
    expect(error.name).to.equal('Error')
    expect(error.message).to.equal('test')
  })

  it('should send custom metrics', () => {
    const {metric} = loggerPkg.default({Trackers})
    const sentTags = [
      {key: 'some-key', value: 'some-value'},
      {key: 'some-other-key', value: 'some-other-value'}
    ]

    metric({name: 'custom label', tags: sentTags})

    const [event, {name, tags}] = trackerStub.emit.getCall(0).args

    expect(event).to.equal('METRIC')
    expect(name).to.equal('custom label')
    expect(tags).to.deep.equal(sentTags)
  })

  it('should send timing metrics', () => {
    const {timing} = loggerPkg.default({Trackers})
    const sentTags = [
      {key: 'some-key', value: 'some-value'},
      {key: 'some-other-key', value: 'some-other-value'}
    ]
    const sentAmount = 13.5

    timing({name: 'custom label', amount: sentAmount, tags: sentTags})

    const [event, {name, amount, tags}] = trackerStub.emit.getCall(0).args

    expect(event).to.equal('TIMING')
    expect(name).to.equal('custom label')
    expect(amount).to.equal(sentAmount)
    expect(tags).to.deep.equal(sentTags)
  })

  it('should send webRuleFailed metrics', () => {
    const {webRuleFailed} = loggerPkg.default({Trackers})
    const numberOfFails = 13.5
    const repository = 'frontend-ma--web-ap'
    const ruleName = 'sui/factory'

    webRuleFailed({ruleName, numberOfFails, repository})

    const [event, {ruleName: ruleNameSent, numberOfFails: numberOfFailsSent, repository: repositorySent}] =
      trackerStub.emit.getCall(0).args

    expect(event).to.equal('WEB_RULE_FAILED')
    expect(ruleName).to.equal(ruleNameSent)
    expect(numberOfFails).to.equal(numberOfFailsSent)
    expect(repository).to.deep.equal(repositorySent)
  })

  it('should send webGoldenPath metrics', () => {
    const {webGoldenPath} = loggerPkg.default({Trackers})
    const repository = 'frontend-ma--web-ap'
    const value = 18
    const ruleName = 'reactVersion'

    webGoldenPath({ruleName, value, repository})

    const [event, {ruleName: ruleNameSent, value: valueSent, repository: repositorySent}] =
      trackerStub.emit.getCall(0).args

    expect(event).to.equal('WEB_GOLDEN_PATH_METRIC')
    expect(ruleName).to.equal(ruleNameSent)
    expect(value).to.equal(valueSent)
    expect(repository).to.deep.equal(repositorySent)
  })

  it('should send distribution metrics', () => {
    const {distribution} = loggerPkg.default({Trackers})
    const sentTags = [
      {key: 'some-key', value: 'some-value'},
      {key: 'some-other-key', value: 'some-other-value'}
    ]
    const sentAmount = 13.5

    distribution({name: 'custom label', amount: sentAmount, tags: sentTags})

    const [event, {name, amount, tags}] = trackerStub.emit.getCall(0).args

    expect(event).to.equal('DISTRIBUTION')
    expect(name).to.equal('custom label')
    expect(amount).to.equal(sentAmount)
    expect(tags).to.deep.equal(sentTags)
  })

  it('should send timing metrics of a function using trace', () => {
    const {trace} = loggerPkg.default({Trackers})
    const name = 'get_user_use_case'
    const value = 'value'

    const fn = trace(name, () => {
      return value
    })

    const current = fn()

    const [event, properties] = trackerStub.emit.getCall(0).args

    expect(current).to.equal(value)
    expect(event).to.equal('TIMING')
    expect(properties.name).to.equal(name)
    expect(typeof properties.amount).to.be.equal('number')
    expect(properties.tags).to.deep.equal([{key: 'status', value: 'success'}])
  })

  it('should send timing metrics of a function using trace with custom tags', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const tags = [{key: 'path', value: '/'}]
    const name = 'get_user_use_case'
    const value = 'value'

    const fn = trace(
      name,
      () => {
        return value
      },
      {tags}
    )

    const current = fn()

    const [event, properties] = trackerStub.emit.getCall(0).args

    expect(current).to.equal(value)
    expect(event).to.equal('TIMING')
    expect(properties.name).to.equal(name)
    expect(typeof properties.amount).to.be.equal('number')
    expect(properties.tags).to.deep.equal([{key: 'status', value: 'success'}, ...tags])
  })

  it('should send timing metrics of a function using trace with callback tags', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const name = 'get_user_use_case'
    const value = 'value'
    const tags = [{key: 'metric', value: 'cls'}]
    const extras = [{key: 'path', value: '/'}]
    const onSuccess = sinon.spy(() => extras)

    const fn = trace(
      name,
      () => {
        return value
      },
      {tags, onSuccess}
    )

    const current = fn()
    const [event, properties] = trackerStub.emit.getCall(0).args

    expect(current).to.equal(value)
    expect(event).to.equal('TIMING')
    expect(properties.name).to.equal(name)
    expect(typeof properties.amount).to.be.equal('number')
    expect(properties.tags).to.deep.equal([{key: 'status', value: 'success'}, ...tags, ...extras])
    expect(onSuccess.calledWith(value)).to.be.true
  })

  it('should send success timing metrics of an async function using trace', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const name = 'get_user_use_case'
    const value = 'value'

    const fn = trace(name, () => {
      return new Promise(resolve => {
        resolve(value)
      })
    })

    const current = await fn()

    const [event, properties] = trackerStub.emit.getCall(0).args

    expect(current).to.equal(value)
    expect(event).to.equal('TIMING')
    expect(properties.name).to.equal(name)
    expect(typeof properties.amount).to.be.equal('number')
    expect(properties.tags).to.deep.equal([{key: 'status', value: 'success'}])
  })

  it('should send success timing metrics of an async function using trace with custom tags', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const tags = [{key: 'path', value: '/'}]
    const name = 'get_user_use_case'
    const value = 'value'

    const fn = trace(
      name,
      () => {
        return new Promise(resolve => {
          resolve(value)
        })
      },
      {tags}
    )

    const current = await fn()

    const [event, properties] = trackerStub.emit.getCall(0).args

    expect(current).to.equal(value)
    expect(event).to.equal('TIMING')
    expect(properties.name).to.equal(name)
    expect(typeof properties.amount).to.be.equal('number')
    expect(properties.tags).to.deep.equal([{key: 'status', value: 'success'}, ...tags])
  })

  it('should send success timing metrics of an async function using trace with callback tags', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const tags = [{key: 'path', value: '/'}]
    const extras = [{key: 'metric', value: 'cls'}]
    const onSuccess = sinon.spy(() => extras)
    const name = 'get_user_use_case'
    const value = 'value'

    const fn = trace(
      name,
      () => {
        return new Promise(resolve => {
          resolve(value)
        })
      },
      {tags, onSuccess}
    )

    const current = await fn()

    const [event, properties] = trackerStub.emit.getCall(0).args

    expect(current).to.equal(value)
    expect(event).to.equal('TIMING')
    expect(properties.name).to.equal(name)
    expect(typeof properties.amount).to.be.equal('number')
    expect(properties.tags).to.deep.equal([{key: 'status', value: 'success'}, ...tags, ...extras])
    expect(onSuccess.calledWith(value)).to.be.true
  })

  it('should send error timing metrics of an async function using trace', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const name = 'get_user_use_case'
    const error = new Error()

    const fn = trace(name, () => {
      return new Promise((resolve, reject) => {
        reject(error)
      })
    })

    try {
      await fn()
    } catch (current) {
      const [event, properties] = trackerStub.emit.getCall(0).args

      expect(current).to.equal(error)
      expect(event).to.equal('TIMING')
      expect(properties.name).to.equal(name)
      expect(typeof properties.amount).to.be.equal('number')
      expect(properties.tags).to.deep.equal([{key: 'status', value: 'fail'}])
    }
  })

  it('should send error timing metrics of an async function using trace with custom tags', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const tags = [{key: 'path', value: '/'}]
    const name = 'get_user_use_case'
    const error = new Error()

    const fn = trace(
      name,
      () => {
        return new Promise((resolve, reject) => {
          reject(error)
        })
      },
      {tags}
    )

    try {
      await fn()
    } catch (current) {
      const [event, properties] = trackerStub.emit.getCall(0).args

      expect(current).to.equal(error)
      expect(event).to.equal('TIMING')
      expect(properties.name).to.equal(name)
      expect(typeof properties.amount).to.be.equal('number')
      expect(properties.tags).to.deep.equal([{key: 'status', value: 'fail'}, ...tags])
    }
  })

  it('should send error timing metrics of an async function using trace with callback tags', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const tags = [{key: 'path', value: '/'}]
    const extras = [{key: 'type', value: 'not_found'}]
    const onError = sinon.spy(() => extras)
    const name = 'get_user_use_case'
    const error = new Error()

    const fn = trace(
      name,
      () => {
        return new Promise((resolve, reject) => {
          reject(error)
        })
      },
      {tags, onError}
    )

    try {
      await fn()
    } catch (current) {
      const [event, properties] = trackerStub.emit.getCall(0).args

      expect(current).to.equal(error)
      expect(event).to.equal('TIMING')
      expect(properties.name).to.equal(name)
      expect(typeof properties.amount).to.be.equal('number')
      expect(properties.tags).to.deep.equal([{key: 'status', value: 'fail'}, ...tags, ...extras])
      expect(onError.calledWith(error)).to.be.true
    }
  })

  it('should filter error timing metrics of an async function using trace', async () => {
    const {trace} = loggerPkg.default({Trackers})
    const tags = [{key: 'path', value: '/'}]
    const filter = sinon.spy(() => true)
    const name = 'get_user_use_case'
    const error = new Error()

    const fn = trace(
      name,
      () => {
        return new Promise((resolve, reject) => {
          reject(error)
        })
      },
      {tags, filter}
    )

    try {
      await fn()
    } catch (current) {
      expect(filter.calledWith(error)).to.be.true
      expect(trackerStub.emit.called).to.be.false
    }
  })

  it('should log errors of an async function using trace', async () => {
    const {trace} = loggerPkg.default({Trackers})

    const name = 'this_should_fail_use_case'
    const error = new Error('Oops!')

    const fn = trace(
      name,
      () => {
        return new Promise((resolve, reject) => {
          reject(error)
        })
      },
      {logErrors: true}
    )

    try {
      await fn()
    } catch (current) {
      const [, {error}] = trackerStub.emit.getCall(1).args

      expect(error.name).to.equal('Error')
      expect(error.message).to.equal('Oops!')
    }
  })
})

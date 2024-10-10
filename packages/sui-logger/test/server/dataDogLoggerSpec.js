import {expect} from 'chai'
import sinon from 'sinon'

import {DataDogLogger} from '../../src/server/expressMiddleware/DataDogLogger.js'
import routes from '../helpers/routes.js'

const dataDogClientMock = {
  timing: (type, duration, globalTags) => {}
}

const defaultChunk = {
  req: {
    headers: {
      http_x_distil_requestid: 'distil',
      'X-Forwarded-For': 'forwarded',
      http_x_amz_cf_id: 'e77d4e109eccdaec9de339321a9bae8b',
      host: ''
    },
    method: 'GET',
    url: '/mi-cuenta',
    'user-agent':
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
  },
  res: {
    statusCode: '200'
  },
  time: 1,
  duration: 1,
  name: 'test'
}

describe('DataDogLogger (Writtable Stream)', () => {
  const sandbox = sinon.createSandbox()

  let dataDogStream

  beforeEach(() => {
    sandbox.spy(dataDogClientMock)
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('Should send logging data for status family 3xx to DataDog client', () => {
    const chunk = {
      ...defaultChunk,
      res: {
        statusCode: '300'
      }
    }

    dataDogStream = new DataDogLogger({client: dataDogClientMock, routes: []})
    sandbox.spy(dataDogStream)

    dataDogStream.write(chunk)

    expect(dataDogStream._write.calledOnce).to.equal(true)
    expect(dataDogStream._write.getCall(0).firstArg).to.eql(chunk)
    expect(dataDogClientMock.timing.calledOnce).to.equal(true)
  })

  it('Should send logging data for status family 4xx to DataDog client', () => {
    const chunk = {
      ...defaultChunk,
      res: {
        statusCode: '400'
      }
    }

    dataDogStream = new DataDogLogger({client: dataDogClientMock, routes: []})
    sandbox.spy(dataDogStream)

    dataDogStream.write(chunk)

    expect(dataDogStream._write.calledOnce).to.equal(true)
    expect(dataDogStream._write.getCall(0).firstArg).to.eql(chunk)
    expect(dataDogClientMock.timing.calledOnce).to.equal(true)
  })

  it('Should send logging data for status family 5xx to DataDog client', done => {
    const chunk = {
      ...defaultChunk,
      res: {
        statusCode: '500'
      }
    }

    dataDogStream = new DataDogLogger({client: dataDogClientMock, routes})
    sandbox.spy(dataDogStream)

    dataDogStream.write(chunk)

    expect(dataDogStream._write.calledOnce).to.equal(true)
    expect(dataDogStream._write.getCall(0).firstArg).to.eql(chunk)

    setTimeout(() => {
      expect(dataDogClientMock.timing.calledOnce).to.equal(true)
      done()
    }, 100)
  })

  it('Should not send logging data if there are no routes', () => {
    dataDogStream = new DataDogLogger({client: dataDogClientMock, routes: []})
    sandbox.spy(dataDogStream)

    dataDogStream.write(defaultChunk)

    expect(dataDogStream._write.calledOnce).to.equal(true)
    expect(dataDogStream._write.getCall(0).firstArg).to.eql(defaultChunk)
    expect(dataDogClientMock.timing.notCalled).to.equal(true)
  })

  it('Should send logging data if there are routes', done => {
    dataDogStream = new DataDogLogger({client: dataDogClientMock, routes})
    sandbox.spy(dataDogStream)

    dataDogStream.write(defaultChunk)

    expect(dataDogStream._write.calledOnce).to.equal(true)
    expect(dataDogStream._write.getCall(0).firstArg).to.eql(defaultChunk)

    // There is some async code in DD Stream
    setTimeout(() => {
      expect(dataDogClientMock.timing.calledOnce).to.equal(true)
      done()
    }, 100)
  })
})

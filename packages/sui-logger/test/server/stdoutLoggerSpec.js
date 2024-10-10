import {expect} from 'chai'
import sinon from 'sinon'

import {StdoutLogger, StringStream} from '../../src/server/expressMiddleware/StdoutLogger'

describe('StringStream (Readable)', () => {
  const sandbox = sinon.createSandbox()
  let stringStream

  after(function () {
    sandbox.restore()
    stringStream = null
  })

  it('Should push a buffer with injected string parameter', () => {
    stringStream = new StringStream('message')
    sandbox.spy(stringStream)

    stringStream.on('end', () => {
      expect(stringStream._read.calledOnce).to.equal(true)
      expect(stringStream.push.calledTwice).to.equal(true)
      expect(Buffer.isBuffer(stringStream.push.getCall(0).firstArg)).to.equal(true)
      expect(stringStream.push.getCall(0).firstArg.toString()).to.equal('message')
    })
  })
})

describe('StdoutLogger (Writtable)', () => {
  const sandbox = sinon.createSandbox()
  const team = 'team'
  const chunk = {
    req: {
      headers: {
        http_x_distil_requestid: 'distil',
        'X-Forwarded-For': 'forwarded',
        http_x_amz_cf_id: 'e77d4e109eccdaec9de339321a9bae8b',
        host: ''
      },
      method: 'GET',
      url: 'localhost:3000',
      'user-agent':
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
    },
    res: {
      statusCode: 200
    },
    time: 1,
    duration: 1,
    name: 'test'
  }
  let stdoutStream

  before(() => {
    stdoutStream = new StdoutLogger({stream: StringStream, team})
    sandbox.spy(stdoutStream)
    sandbox.spy(process)
  })

  after(function () {
    sandbox.restore()
    stdoutStream = null
  })

  it('Should push a buffer with injected string parameter', () => {
    // node-bunyan executes that inside bunyan-middleware
    stdoutStream.write(chunk)

    expect(stdoutStream._write.calledOnce).to.equal(true)
    expect(stdoutStream._write.getCall(0).firstArg).to.eql(chunk)
    expect(process.nextTick.getCalls().length).to.eql(1)
  })
})

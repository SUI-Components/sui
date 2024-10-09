import {expect} from 'chai'
import sinon from 'sinon'

import {traceInitialProps} from '../../src/index.js'
import * as loggerPkg from '../../src/logger.js'

const Trackers = {
  create: () => {}
}

describe('traceInitialProps', () => {
  const sandbox = sinon.createSandbox()
  let emitStub

  beforeEach(() => {
    emitStub = sandbox.stub()
    sandbox.stub(Trackers, 'create').returns({emit: emitStub})
  })

  afterEach(() => {
    emitStub = null
    sandbox.restore()
  })

  it('should send success timing metric', async () => {
    const logger = loggerPkg.default({Trackers})
    const context = {logger}
    const props = {}
    const path = '/:lang'
    const routeInfo = {routes: [{path}]}

    const getInitialProps = traceInitialProps(() => Promise.resolve(props))
    const current = await getInitialProps({context, routeInfo})

    expect(current).to.be.equal(props)

    const [event, properties] = emitStub.getCall(0).args

    expect(event).to.equal('TIMING')
    expect(properties.name).to.equal('trace')
    expect(typeof properties.amount).to.be.equal('number')
    expect(properties.tags).to.deep.equal([
      {
        key: 'status',
        value: 'success'
      },
      {
        key: 'pathname',
        value: path
      }
    ])
  })

  it('should send fail timing metric', async () => {
    const logger = loggerPkg.default({Trackers})
    const context = {logger}
    const path = '/:lang'
    const routeInfo = {routes: [{path}]}
    const error = new Error()

    const getInitialProps = traceInitialProps(() => Promise.reject(error))

    try {
      await getInitialProps({context, routeInfo})
    } catch (current) {
      expect(current).to.be.equal(error)

      const [event, properties] = emitStub.getCall(0).args

      expect(event).to.equal('TIMING')
      expect(properties.name).to.equal('trace')
      expect(typeof properties.amount).to.be.equal('number')
      expect(properties.tags).to.deep.equal([
        {
          key: 'status',
          value: 'fail'
        },
        {
          key: 'pathname',
          value: path
        }
      ])
    }
  })

  it('should keep working even though there is no logger inside the context', async () => {
    const context = {}
    const props = {}
    const path = '/:lang'
    const routeInfo = {routes: [{path}]}

    const getInitialProps = traceInitialProps(() => Promise.resolve(props))
    const current = await getInitialProps({context, routeInfo})

    expect(current).to.be.equal(props)
  })
})

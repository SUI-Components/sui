import {expect} from 'chai'
import sinon from 'sinon'

import FetcherInterceptor from '../../src/fetcher/FetcherInterceptor.js'

describe('FetcherInterceptor', () => {
  const interceptableMockedFetcher = statusCode => {
    return {
      get: async () => {
        if (statusCode !== 200) throw new Error(`HTTP simulated error: ${statusCode}`)

        return 'It works!'
      }
    }
  }

  it('should return the expected value if no error occurs', async () => {
    const fetcher = new FetcherInterceptor({
      config: {},
      fetcher: interceptableMockedFetcher(200)
    })

    // Do not encapsulate inside a try-catch: If it fails test should be considered failed
    const result = await fetcher.get('/')

    expect(result).to.eql('It works!')
  })

  it('should return errors to the original caller even if using the FetcherInterceptor wrapper', async () => {
    const fetcher = new FetcherInterceptor({
      config: {},
      fetcher: interceptableMockedFetcher(401)
    })

    try {
      await fetcher.get('/')
    } catch (error) {
      expect(error.message).to.eql(`HTTP simulated error: 401`)
    }
  })

  it('should call the error interceptor when a exception occurs', async () => {
    const fetcher = new FetcherInterceptor({
      config: {},
      fetcher: interceptableMockedFetcher(401)
    })

    const callback = sinon.spy()
    fetcher.setErrorInterceptor({callback})

    try {
      await fetcher.get('/')
    } catch (error) {
      expect(error.message).to.eql(`HTTP simulated error: 401`)
    }

    expect(callback.called).to.be.true
    const result = callback.firstCall.args[0]
    expect(result).to.be.instanceOf(Error)
  })
})

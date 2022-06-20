import {expect} from 'chai'
import {setupServer} from 'msw/node/lib/index.js'

import {setupPactMswAdapter} from '@pactflow/pact-msw-adapter'

import {
  getContractTests,
  mapProviders,
  toQueryString,
  writerFactory
} from './utils.js'

export default ({
  apiUrl,
  consumer,
  providers,
  fetcher,
  defaultOptions,
  excludeHeaders = ['x-powered-by', 'accept', 'user-agent', 'cookie'],
  contractsDir = './contract/documents'
}) => {
  const server = setupServer()
  const pactMswAdapter = setupPactMswAdapter({
    server,
    options: {
      consumer,
      providers: mapProviders(providers),
      pactOutDir: contractsDir,
      excludeHeaders
    }
  })
  const tests = getContractTests({apiUrl, providers})

  describe('Consumer test contracts', () => {
    before(async () => {
      server.listen({
        onUnhandledRequest: 'warn'
      })
    })

    beforeEach(async () => {
      pactMswAdapter.newTest()
    })

    afterEach(async () => {
      pactMswAdapter.verifyTest()
      server.resetHandlers()
    })

    after(async () => {
      const writer = writerFactory(providers)

      await pactMswAdapter.writeToFile(writer)
      pactMswAdapter.clear()
      server.close()
    })

    tests.forEach(
      ({
        description,
        endpoint,
        query,
        body,
        method = 'get',
        handler,
        options = defaultOptions,
        response
      }) => {
        it(`makes ${description.toLowerCase()}`, async () => {
          server.use(handler)

          let url = `${apiUrl}${endpoint}`
          if (query) url = `${url}?${toQueryString(query)}`

          const {data} = body
            ? await fetcher[method](url, body, options)
            : await fetcher[method](url, options)

          if (data) expect(data).to.deep.equal(response)
        })
      }
    )
  })
}

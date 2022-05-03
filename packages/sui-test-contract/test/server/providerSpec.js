import {expect} from 'chai'
import {getProvider} from '../../src/index.js'
import axios from 'axios'

const logLevel = 'DEBUG'
const port = 8123

// TODO: SKIP FOR NOW AS IT DOES NOT WORK WITH NODE 18
describe.skip('getProvider', () => {
  let provider

  it('Should instance with options', async () => {
    // Given
    const consumer = 'web-app'
    const providerName = 'ms-api'

    // When
    provider = getProvider({
      consumer,
      provider: providerName,
      logLevel,
      port
    })

    await provider.setup()

    // Then
    const options = provider.opts

    expect(options.consumer).to.eql(consumer)
    expect(options.provider).to.eql(providerName)
    expect(options.logLevel).to.eql(logLevel)
    expect(options.port).to.eql(port)

    // And
    expect(provider.setup).to.exist
    expect(provider.addInteraction).to.exist
    expect(provider.verify).to.exist
    expect(provider.finalize).to.exist
  })

  after(async () => {
    await provider.finalize()
  })
})

describe('Consumer test', () => {
  let provider

  before(async () => {
    provider = getProvider({
      consumer: 'test-app',
      provider: 'test-api',
      port,
      logLevel
    })

    await provider.setup()
  })

  describe('addInteraction', () => {
    const interactionResponse = {context: 'test'}

    before(async () => {
      await provider.addInteraction({
        state: 'I have a test interaction',
        uponReceiving: 'A test response',
        withRequest: {
          method: 'GET',
          path: `/test`
        },
        willRespondWith: {
          status: 200,
          body: interactionResponse
        }
      })
    })

    it('should respond to interaction', async () => {
      const response = await axios.get('http://localhost:8123/test')
      expect(response.data).to.eql(interactionResponse)
    })
  })

  after(async () => {
    await provider.finalize()
  })
})

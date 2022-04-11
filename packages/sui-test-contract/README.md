# sui-test-contract

> Useful tooling for executing contract tests.

## Using the provider instance

In order to start using the contract tests in your app, you'll need to instance the "provider". It will allow you to create the interactions, test them and finally it will create the contract documents (in the relative path: `contract/documents`).

Here you have a detailed example:

```js
// This file should be placed in a path like:
// `contract/test/foo/consumerSpec.js`
import {getProvider} from '@s-ui/test-contract'

describe('Consumer contract for: Foo API', () => {
  // Declare the provier in a global scope
  let provider

  before(async () => {
    // First, instance the provider
    provider = getProvider({
      provider: 'foo-api',
      consumer: 'foo-web'
    })

    // Then, await for the setup
    await provider.setup()
  })

  after(async () => {
    // Finalize the contracts
    await provider.finalize()
  })

  afterEach(async () => {
    // Verify each interaction
    await provider.verify()
  })

  describe('- Interaction for: Foo API Endpoint', () => {
    before(async () => {
      // Add the interaction before each test
      await provider.addInteraction({
        state: `I have a list of movies`,
        uponReceiving: `A request for getting the movies`,
        withRequest: {
          method: 'GET',
          path: '/movies'
        },
        willRespondWith: {
          status: 200,
          body: [
            {
              id: 1,
              name: 'The Lord of the Rings: The Fellowship of the Ring',
              coverId: '1-s'
            },
            {
              id: 2,
              name: 'The Lord of the Rings: The Two Towers',
              coverId: '2-s'
            },
            {
              id: 3,
              name: 'The Lord of the Rings: The Return of the King',
              coverId: '3-s'
            }
          ]
        }
      })
    })

    it('Should return a list of movies', () => {
      // Try to fetch the resources you need
      // By default, provider will expect requests at "http://localhost:8080",
      // you can override the port when instancing it
      fetch('http://localhost:8080/movies')
        .then(response => response.json())
        .then(data => {
          // Do your expects
          expect(data[0].id).to.equal(1)
        })
    })
  })
})
```

ℹ️ More info: https://github.com/pact-foundation/pact-js#consumer-side-testing

## Publishing the contracts

When you have your contract documents generated (e.g.: `contract/documents/foo-web-foo-api.json`), you'll need to publish them to the "broker", the place where providers (API Backend) will validate their own tests against the contracts.

You just need to run the following command:

```bash
sui-test-contract publish --broker-url "https://my-contract-tests-broker.com"
```

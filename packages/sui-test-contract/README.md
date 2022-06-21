# sui-test-contract

> Useful tooling for defining contract tests (based on [Pact](https://docs.pact.io/)) that will generate contract documents. It will also allow us to publish such documents into a defined [Pact Broker](https://docs.pact.io/pact_broker).

## Dependencies

This package depends on the API mocking tool [MSW](https://mswjs.io/). That means all the mocking requests should be handled by such tool, and the recommendation is to share the mocks along your whole app, so they should be placed in a unique folder named `mocks` in the root of your project.

## Environment

These kind of contract test are intended to be executed in a server side environment with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/). It's recommended to use the package [@s-ui/test](https://github.com/SUI-Components/sui/tree/master/packages/sui-test) for executing them.

## Using the setup function

In order to start using the contract tests in your app, you'll need to execute the `setupContractTests` function passing the needed parameters. It will allow you to create the interactions, test them and finally it will generate the contract documents (in the path: `contract/documents` by default).

It's important to know that **YOU'LL NEED TO EXECUTE THIS FUNCTION IN A TEST FILE** (e.g.: `consumerSpec.js`)

Here you have a detailed example:

```js
// `mocks/apples/responses.js`
export const applesResponse = [
  {color: 'red', type: 'Fuji'},
  {color: 'green', type: 'Granny Smith'}
]
```

```js
// `mocks/apples/handlers.js`
import {rest} from 'msw'
import {applesResponse} from './responses.js'

export const applesRequestHandler = rest.get(
  'http://localhost:8181/apples',
  (req, res, ctx) => res(ctx.status(200), ctx.json(applesResponse))
)
```

```js
// This file should be placed in a path like:
// `contract/test/apples/consumerSpec.js`
import {expect} from 'chai'
import {FetcherFactory} from '@s-ui/domain'
import {setupContractTests} from '@s-ui/test-contract'
import {applesResponse} from '../../../../mocks/apples/responses.js'
import {applesRequestHandler} from '../../../../mocks/apples/handlers.js'

const fetcher = FetcherFactory.httpFetcher({config: {}})
const consumer = 'test-consumer'

setupContractTests({
  apiUrl: 'http://localhost:8181',
  consumer,
  fetcher,
  providers: {
    'test-provider': [
      {
        endpoint: '/apples',
        description: 'A request for getting some apples',
        state: 'I have some apples',
        handler: applesRequestHandler,
        response: applesResponse
      }
    ]
  }
})
```

### Setup options

| Parameter        | Required | Type      | Default                                              | Description                                                                                                                 |
| ---------------- | -------- | --------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `apiUrl`         | Yes      | `string`  |                                                      | Complete URL where the requests should be done                                                                              |
| `consumer`       | Yes      | `string`  |                                                      | Name of the API consumer                                                                                                    |
| `providers`      | Yes      | `object`  |                                                      | Object of providers containing an array of interactions (see [Provider interaction options](#provider-interaction-options)) |
| `fetcher`        | Yes      | `Fetcher` |                                                      | Instance of a fetcher class (e.g. Axios)                                                                                    |
| `defaultOptions` | No       | `object`  |                                                      | Default options for the requests                                                                                            |
| `excludeHeaders` | No       | `array`   | `['x-powered-by', 'accept', 'user-agent', 'cookie']` | Headers to be excluded in the generated contracts                                                                           |
| `contractsDir`   | No       | `string`  | `./contract/documents`                               | Path to the directory that will contain the generated contracts                                                             |

### Provider interaction options

| Parameter     | Required | Type                                                                                                                | Default                                         | Description                                   |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- | --- |
| `description` | Yes      | `string`                                                                                                            |                                                 | Description for the interaction               |
| `state`       | Yes      | `string`                                                                                                            |                                                 | State to be matched by the provider           |
| `endpoint`    | Yes      | `string`                                                                                                            |                                                 | Endpoint to be added in the contract document |
| `query`       | No       | `object`                                                                                                            |                                                 | Query params if needed in the request         |
| `body`        | No       | See possibilities for [Fetch API Body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#body) |                                                 | Body to be sent in the request                |
| `method`      | No       | `string`                                                                                                            | `get`                                           | Request method                                |
| `handler`     | Yes      | [Request handler](https://mswjs.io/docs/basics/request-handler)                                                     |                                                 | Request handler used in the contract test     |
| `options`     | No       | `object`                                                                                                            | `defaultOptions` (from the setup configuration) | Request options                               |
| `response`    | Yes      | `any`                                                                                                               |                                                 | Response to be validated in the contract test |     |

## Publishing the contracts

When you have your contract documents generated (e.g.: `contract/documents/test-consumer-test-provider-123456789.json`), you'll need to publish them to the [Pact Broker](https://docs.pact.io/pact_broker), the place where providers (API Backend) will validate their own tests against the contracts.

You just need to run the following command:

```bash
sui-test-contract publish --broker-url "https://my-contract-tests-broker.com"
```

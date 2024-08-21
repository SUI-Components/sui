# sui-mock

It is mainly a wrapper around [Mock Service Worker (MSW)](https://mswjs.io/).
It allows mocking by intercepting requests on the network level. Seamlessly reuse the same mock definition for testing, development, and debugging.

## Installation

```sh
npm install @s-ui/mock --save-dev
```

## Mockers

#### Request mocking with `setupMocker`

It returns all methods included in `setupWorker` and `setupServer`. It will work in browser and server sides.

👉 Check `setupWorker` and `setupServer` in [MSW docs](https://mswjs.io/docs/api/).


## Usage

### 1. Create Request handlers

First of all we need to define the application request handlers. Request handler is a function that determines whether an outgoing request should be mocked, and specifies its mocked response.

Create a `./mocks` folder in your project root and create a `handlers.js` file inside it.

This `handlers.js` should export an array of [Request handlers](https://mswjs.io/docs/basics/request-handler).

**Example: How to create a handler**

In this case, given the request handler ([GET] `/user`) it specifies a response resolver mocked response (status 200 with body `{name: 'John Doe'}`).

```js
// ./mocks/exampleGateway/user/handlers.js
import {rest} from 'msw'
import {apiUrl} from '../config.js'

const responseResolver = () => res(ctx.status(200), ctx.json({name: 'John Doe'}))

export const getUserHandler = rest.get(`${apiUrl}/user`, responseResolver)
```

Then, we export the list of handlers

```js
// ./mocks/handlers.js
import {getUserHandler} from './mocks/exampleGateway/user/handlers.js'

export default [getUserHandler]
```

### 1.1 Autoload mocks folder.

Any file, under the folder `routes` will be autoloaded and you dont have to do anything to see your handler capturing request.

When you use the autoload feature, you have to create a folder structure following the same structure than your API request.

For example, to capture the request `https://api.site.com/api/v1/user/123/settings`, your folder structure in your project will be:

```
[root mono-repo]
 |
 - mocks
    |
    - routes
        |
        - api
            |
            - v1
                |
                - user
                    |
                    - :id
                        |
                        - settings
                            |
                            - index.js
```

Your `index.js` file has to expose a function for each http method that you want to capture:

```js
export async function get({headers, body, params, query, cookies}) {
  return [200, {name: 'nombre'}]
}
export async function post({headers, body, params, query, cookies}) {
  return [200, {params}]
}
export async function put() {}
export async function del() {}
```

Every function have to return the status code of the request and the body.

### 2. Expose mocker from mocks folder

Once we have the handlers created, we will need to create a mocker with **all the handlers already defined**.

```js
// ./mocks/index.js
import {setupMocker, rest} from '@s-ui/mock'
import applicationHandlers from './handlers.js'

const getMocker = (handlers = applicationHandlers) => setupMocker(handlers)
const getEmptyMocker = setupMocker

export {getEmptyMocker, getMocker, rest}
```

### 3. Use it everywhere

Use this mocker everywhere in your application, it means integration tests, e2e tests, component tests, etc. but also in your application code.

Example of mocking in browser:

```js
// src/app.js
if (process.env.STAGE === 'development') {
  const mocker = await import('../mocks/index.js').then(pkg =>
    pkg.getMocker()
  )
  mocker.start({onUnhandledRequest: 'bypass'})
}
```

Example of mocking in server:

```js
// src/hooks/preSSRHandler/index.js
if (process.env.STAGE === 'development') {
  const mocker = await import('../../../mocks/index.js').then(pkg =>
    pkg.getMocker()
  )

  mocker.start({onUnhandledRequest: 'bypass'})
}
```

Example of mocking in unit tests **with all handlers**:

```js
// domain/test/example/exampleSpec.js
import axios from 'axios'
import {getMocker} from '../../../mocks/index.js'

describe('Example', () => {
  let mocker

  before(async () => {
    mocker = await getMocker()
    await mocker.start()
  })

  after(() => {
    mocker.stop()
  })

  it('should do something', async () => {
    const result = await axios.get('/user?id=1')
    expect(result).to.be.deep.equal({name: 'John Doe'})
  })

  it('should throw an error', async () => {
    // We also could define a handler for this case
    const getUserGenericErrorHandler = rest.get('/user', () => {
      const error = {
        errorMessage: `User '${username}' not found`,
      }

      return res(ctx.status(404), ctx.json(error))
    })

    mocker.use(getUserGenericErrorHandler)

    try {
      const result = await axios.get('/user?id=1')
    } catch(error) {
      expect(error).to.be.an.instanceof(Error)
    }

  })
})
```

Example of mocking in unit tests **without default handlers**:

```js
// domain/test/example/exampleSpec.js
import axios from 'axios'
import {getEmptyMocker} from '../../../mocks/index.js'
import {getUserHandler} from '../../../mocks/userGateway/user/handlers.js'

describe('Example', () => {
  let mocker

  before(async () => {
    mocker = await getEmptyMocker()
    await mocker.start()
  })

  after(() => {
    mocker.stop()
  })

  // This is important to restore handlers after each test
  afterEach(() => {
    mocker.resetHandlers()
  })

  it('should do something', async () => {
    // IMPORTANT: Explicit define handlers for this test
    mocker.use(getUserHandler)

    const result = await axios.get('/user?id=1')
    expect(result).to.be.deep.equal({name: 'John Doe'})
  })
})
```

Example of mocking in E2E tests:


```js
it("should get todo data - MSW will be overridden", () => {
  cy.window().then(window => {
    const { worker, rest } = window.msw;

    worker.use(
      rest.get(`${API_URL}todos/1`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: 1,
            title: "Mocked by not MSW but Cypress",
            completed: true
          })
        );
      })
    );
  });
  // Assert that the title is not "Mocked by MSW"
  cy.contains("Mocked by not MSW but Cypress");
});
```

### 4. Make Cypress integration stable

When we run E2E test, if we start our mocker in application code it could cause a race condition and the mocker could be started before the E2E test.

To fix that, it is recommended to avoid starting the mocker in application code and start it in E2E environment.

Example of starting mocker in Cypress environment

```js
// test-e2e/support/setup.js
import {getMocker, rest} from '../../mocks/index.js'

// cypress/supports/index.js
Cypress.on('test:before:run:async', async () => {
  if (window.msw) return

  const mocker = await getMocker()
  await mocker.start({onUnhandledRequest: 'bypass'})

  window.msw = {
    worker: mocker,
    rest
  }
})
```

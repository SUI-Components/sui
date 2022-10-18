# sui-mock-provider

## Getting Started

### Installation

### Usage

#### 1. Create Request handlers
Create a `./mocks` folder in your project root and create a `index.js` file inside it.

This index.js should export an array of [Request handlers](https://mswjs.io/docs/basics/request-handler).

**Example:**

Given, a provider endpoint handler

```js
// ./mocks/exampleGateway/user/handlers.js
import {rest} from 'msw'
import {apiUrl} from '../config.js'

const responseResolver = () => res(ctx.status(200), ctx.json({name: 'John Doe'}))

export const getUserHandler = rest.get(`${apiUrl}/user`, responseResolver)
```

Then, we export a list of handlers

```js
// ./mocks/index.js
import {getUserHandler} from './mocks/exampleGateway/user/handlers.js'

export default [getUserHandler]
```

#### 2. Expose mocker from mocks folder

We should use browser or server getMocker to create a mocker instance ready to use in our app. See how it will looks like:

```js
// ./mocks/server.js
import {getServerMocker} from '@s-ui/mock-provider/lib/server'
import handlers from './index.js'

export {rest} from '@s-ui/mock-provider/lib/browser'
export const mocker = getServerMocker(...handlers)
```

```js
// ./mocks/browser.js
import {getBrowserMocker} from '@s-ui/mock-provider/lib/browser'
import handlers from './index.js'

export {rest} from '@s-ui/mock-provider/lib/browser'
export const mocker = getBrowserMocker(...handlers)
```

Given we have isomorphic tests in our project, we should create a `./mocks/isomorphicMocker.js` file that exports the mocker instance depending on the environment (browser / server).

```js
// ./mocks/isomorphicMocker.js
import initMocker from '@s-ui/mock-provider'
import applicationHandlers from './index.js'

export {rest} from '@s-ui/mock-provider/lib/browser'
export const getMocker = (handlers = applicationHandlers) =>
  initMocker(handlers)
```

#### 3. Use it everywhere
Use those mockers to init your mocks everywhere in your application, it means integration tests, e2e tests, component tests, etc. but also in your application code.

Browser example:

```js
// src/app.js
if (process.env.STAGE === 'development') {
  const worker = await import('../mocks/browser.js').then(
    pkg => pkg.worker
  )
  worker.start({onUnhandledRequest: 'bypass'})
}
```

Server example:

```js
// src/hooks/preSSRHandler/index.js
if (process.env.STAGE === 'development') {
  const worker = await import('../../../mocks/server.js').then(
    pkg => pkg.worker
  )

  worker.listen()
}
```

Text example

```js
// domain/test/example/exampleSpec.js
import axios from 'axios'
import {getMocker} from '../../../mocks/isomorphicMocker.js'

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
})
```

E2E example:

```js
// test-e2e/support/setup.js
import {mocker, rest} from '../../mocks/browser.js'

Cypress.on('test:before:run:async', async () => {
  if (window.msw) return

  await mocker.start({onUnhandledRequest: 'bypass'})

  window.msw = {
    worker: mocker,
    rest
  }
})
```

### Mockers

- `initMocker` is isomorphic and returns all methods included in `setupWorker` and `setupServer`. Check it out [here](https://mswjs.io/docs/api/).

- `getServerMocker` is server only and returns all methods included in `setupWorker` and `setupServer`. Check it out [here](https://mswjs.io/docs/api/setup-server). 

- `setupBrowserMocker` is browser only and returns all methods included in `setupWorker` and `setupServer`. Check it out [here](https://mswjs.io/docs/api/setup-worker).
# sui-mock

### Installation

```sh
npm install @s-ui/mock --save-dev
```

### Mockers

#### Request mocking with `setupMocker`

It returns all methods included in `setupWorker` and `setupServer`. It will work in browser and server sides.

👉 Check `setupWorker` and `setupServer` in [MSW docs](https://mswjs.io/docs/api/).


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

Then, we export the list of handlers

```js
// ./mocks/handlers.js
import {getUserHandler} from './mocks/exampleGateway/user/handlers.js'

export default [getUserHandler]
```

#### 2. Expose mocker from mocks folder

We should use browser or server getMocker to create a mocker instance ready to use in our app. See how it will looks like:
```js
// ./mocks/index.js
import {setupMocker, rest} from '@s-ui/mock'
import applicationHandlers from './handlers.js'

const getMocker = (handlers = applicationHandlers) => setupMocker(handlers)

export {getMocker, rest}
```

#### 3. Use it everywhere
Use those mockers to init your mocks everywhere in your application, it means integration tests, e2e tests, component tests, etc. but also in your application code.

Browser example:

```js
// src/app.js
if (process.env.STAGE === 'development') {
  const mocker = await import('../mocks/index.js').then(pkg =>
    pkg.getMocker()
  )
  mocker.start({onUnhandledRequest: 'bypass'})
}
```

Server example:

```js
// src/hooks/preSSRHandler/index.js
if (process.env.STAGE === 'development') {
  const mocker = await import('../../../mocks/index.js').then(pkg =>
    pkg.getMocker()
  )

  mocker.start({onUnhandledRequest: 'bypass'})
}
```

Text example

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
})
```

E2E example:

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

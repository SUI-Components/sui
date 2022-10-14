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

#### 2. Create mocker init factory

In order to use all defined or imported handlers, we need to create a mocker init factory.
This factory will use getMocker function to create a mocker instance.

```js
// ./mocks/initMocker.js
import {getMocker} from '@s-ui/mock-provider'
import applicationHandlers from './index.js'

export const initMocker = (handlers = applicationHandlers) => getMocker(handlers)
```

#### 3. Use it everywhere
Use this `initMocker` to init your mocks everywhere in your application, it means integration tests, e2e tests, component tests, etc. but also in your application code.


### `getMocker`

`getMocker` is isomorphic and returns all methods included in `setupWorker` and `setupServer`. Check it out [here](https://mswjs.io/docs/api/).

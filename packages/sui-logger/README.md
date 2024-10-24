# @s-ui/logger

> Web app logging tools for both, client and server side.

## Table of contents

- [@s-ui/logger ](#s-uilogger-)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Application logging](#application-logging)
    - [Client side logging with reporter](#client-side-logging-with-reporter)
    - [Server side logging](#server-side-logging)
      - [With Stdout](#with-stdout)
      - [With Reporter](#with-reporter)
      - [How to consume Reporter logs](#how-to-consume-reporter-logs)
    - [Server logging](#server-logging)
      - [Express middleware for sui-ssr logging hook](#express-middleware-for-sui-ssr-logging-hook)
        - [StdoutLogger](#stdoutlogger)
        - [DataDogLogger](#datadoglogger)
      - [Express middleware for sui-ssr logging hook using Reporter](#express-middleware-for-sui-ssr-logging-hook-using-reporter)
      - [Tracking page fetching](#tracking-page-fetching)
  - [Consume Stdout logs](#consume-stdout-logs)
  - [Consume Reporter logs](#consume-reporter-logs)

## Installation

`npm install @s-ui/logger`

## Application logging

### Client side logging with reporter

To start logging client-side logs in our application, we should initialize our tracker.

```js
// app.js
import {Reporter} from '@adv-ui/reporter' // Service Logger
import {initTracker} from '@s-ui/logger'

initTracker({Reporter, appName: 'milanuncios', environment: 'production', devMode: false})
```

Options:

- **`Reporter` {Function}** - Application Logger
- **`appName` {String}** - Application name
- **`devMode` {String}** - Allows sending events to the development endpoint, Production endpoint is used by default.
- **`environment` {String}** - Optionally set the environment property to be used as part of the context (e.g. `preproduction` or `production`). If not set `NODE_ENV` will be used as default value
- **`...rest`** - See your Service Logger client configuration

After initializing our tracker, we could create our logger

```js
import {createClientLogger} from '@s-ui/logger'

export const getLogger = ({isClient, userId}) => {
  const logger = isClient ? createClientLogger({userId}) : {} // see next section

  return {logger}
}
```

Options:

- **`userId` {String}** - User id to add to all logs
- **`trackerName` {String}** [optional] - Tracker name that will be used by the microservice
  > 💡 Please note that, if you decide to use a custom trackerName, you'd need to create a custom provider inside your service.

### Server side logging

We could start logging in our app in two different ways.

#### With Stdout

> This logging system is maintained by es-common-platform and get logs automatically from stdout.

This server side logging keeps you log whatever with native console methods. Also, it enables two ways of logging.

- Patch console[log|info|error|warn] in order to re-send console with correct format. You could use native console methods.
- `createServerLogger` returns a logger with `log|info|error|warn` methods in order to be used in our context application. It could be redundant if we like use native console methods.

Also, it will capture unhandled errors and send them as `console.error` with appropriated format.

```js
import {createServerLogger} from '@s-ui/logger/lib/server/logger'

export const getLogger = ({req}) => {
  return createServerLogger({req, team: 'frontend-ma'})
}
```

`createServerLogger` accepts those parameters:

- `req`: server request object
- `getTenantService`: Function to parse request and returns an string with tenant value and add it to logs
- `userId`: user id
- `team`: should match with deploy tags.yml team field.

**Further information**

Enabled by default, there is a ENV var to disable it `DISABLE_SERVER_LOGGER_PATCH=true`. This help us to disable without compile app again.

#### With Reporter

> The Reporter needs a `start` method to inicialize the reporter.

```js
export const initTracker = ({Reporter, appName, environment, version, tenant, ...config}) => {
  const context = {environment: environment || NODE_ENV, isServer, version, tenant}

  Reporter.start(appName, {
    ...config,
    context
  })
}
```

To start logging server-side logs in our application, we should initialize our tracker in one server file

```js
// app.js
import {Reporter} from '@adv-ui/reporter' // Service Logger
import {initTracker} from '@s-ui/logger'

initTracker({Reporter, appName: 'milanuncios', devMode: false})
```

Options:

- **`Reporter` {Function}** - Service Logger
- **`appName` {String}** - Application name
- **`devMode` {String}** - Allows sending events to the development endpoint, Production endpoint is used by default.
- **`...rest`** - See your Service Logger client configuration

After initializing our tracker, we could create our logger.

```js
import {createServerLogger} from '@s-ui/logger'

export const getLogger = ({isClient, userId}) => {
  const logger = isClient
    ? {} // see previous section
    : createServerLogger({userId})

  return {logger}
}
```

Options:

- **`userId` {String}** - User id to add to all logs

#### How to consume Reporter logs

When we create a reporter logger function, we get a logger with three methods: `error`, `log` and `metric`.

**Error method**

It accepts one parameter with `message, name, stack` properties (usually an Error).

```js
logger.error(new Error('Something went wrong'))
```

We could consume in **ELK**:

- `reporter.errorMessage`: {string}
- `reporter.errorName`: {string}
- `reporter.errorStack`: {string}

**Patch native console.error**

It behaves similar to logger.error.

```js
console.error(new Error('Something went wrong'))
```

We could consume in **ELK**:

- `reporter.errorMessage`: {string}
- `reporter.errorName`: {string}
- `reporter.errorStack`: {string}

**Log method**

It accepts a `message` string parameter.

```js
logger.log('Something happened')
```

We could consume in **DataDog**

**Performance method**

This method allows us to record performance metrics, more specifically Core Web Vitals metrics.

In addition to recording the value of the metric, we can record: the path, the element that has triggered or affects the metric, and the status of the load.

| Property               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| name                   | Core Web Vital metric name                       |
| amount                 | The metric value                                 |
| path                   | Application route                                |
| target                 | Element that has triggered or affects the metric |
| [loadState][loadstate] | The loading state of the document                |

> Example with the INP metric

```js
const inpMetrics = {
  name: 'cwv.inp', // Core Web Vital metric name
  amount: '872', //
  path: '/:lang',
  target: 'div.event-target',
  loadState: 'dom-content-loaded'
}

logger.cwv({...inpMetrics})
```

We could consume in Open Search to debug Web Performance Issues.

**Metric method**

It accepts a `Metric` object containing a `name` and `tags`

[Metric type definition](./src/logger.js#73)

> 💡 Please note that in order for metrics to work, you'd need to create a custom provider inside the ms-adit--reporter microservice.

```js
logger.metric({
  name: 'some_metric_name', // 💡 It is highly recommended to use snake_case
  // Anything you wish to tag
  tags: [
    {key: 'isCondition', value: 'yes | no'},
    {key: 'result', value: 'ok'}
  ]
})
```

We can then filter in Datadog with the count of the occurrences for this metric.

**Timing method**

It accepts a `Timing` object containing a `name`, `amount` and `tags`

[Metric type definition](./src/logger.js#94)

> 💡 Please note that similarly to previous method in order to make it work, you'd need to create a custom provider inside the ms-adit--reporter microservice.

```js
logger.timing({
  name: 'some_metric_name', // 💡 It is highly recommended to use snake_case
  amount: 156.43, // Time in milliseconds
  // Anything you wish to tag
  tags: [
    {key: 'isCondition', value: 'yes | no'},
    {key: 'result', value: 'ok'}
  ]
})
```

**Trace method**

It accepts a `name`, a function and optionally an `options` object. The method returns the same function that was provided but wrapped to send performance timing metrics out of the box using the `timing` method.

```js
export default class GetDiscardedListUseCase {
  constructor({repository, logger}) {
    this.repository = repository
    this._logger = logger
    this.execute = this._logger.trace('GetDiscardedListUseCase#execute', this.execute)
  }

  async execute = ({sessionId, userId, locale}) => {
    const discardedList = await this.repository
      .user({id: userId})
      .session({sessionId})
      .getDiscardedList({locale})
    return discardedList.toJSON()
  }
}
```

The `options` object can optionally contain:

- A `tags` field. The tags are a set of properties that will be send in the timing events

- A `logErrors` field. This enables error-logging upon an error occurring

```js
logger.trace('name', () => {}, {
  tags: [{key: 'path', value: '/'}],
  logErrors: true
})
```

- An `onSuccess` callback that can add additional tags when the use case finishes. It will be called with the response of the use case and you can add any other tags that you need.

```js
logger.trace('name', () => {}, {
  tags: [{key: 'path', value: '/'}],
  onSuccess: response => {
    if (response.isProUser === true) {
      return [
        {
          key: 'type',
          value: 'professional'
        }
      ]
    }

    return []
  }
})
```

- An `onError` callback that can add additional tags when the use case fails. It will be called with the error of the use case and you can add any other tags that you need.

```js
logger.trace('name', () => {}, {
  tags: [{key: 'path', value: '/'}],
  onError: error => {
    if (error.message === 'MISSING_INFO') {
      return [
        {
          key: 'reason',
          value: 'missing_info'
        }
      ]
    }

    return []
  }
})
```

- A `filter` callback that can be used to avoid sending metrics when the use case fails.
  - When `true` is returned the metrics and logs are not sent
  - When `false` is returned the metrics and logs are sent

```js
logger.trace('name', () => {}, {
  tags: [{key: 'path', value: '/'}],
  filter: error => {
    return error.message === 'EXPIRED_TOKEN'
  }
})
```

### Server logging

#### Express middleware for sui-ssr logging hook

`@s-ui/ssr` accepts hooks (express middlewares), one of them is for logging and we could add here our logging hook with needed options.

Example file: `./src/hooks/index.js`

```js
import TYPES from '@s-ui/ssr/hooks-types'
import {getExpressMiddleware} from '@s-ui/logger/lib/server/expressMiddleware'
import routes from '../routes'

const getTenantService = req => {
  const TENANT_COCHES = 'coches'
  const TENANT_MOTOS = 'motos'

  return req.headers.host.includes(TENANT_MOTOS) ? TENANT_MOTOS : TENANT_COCHES
}

const loggingMiddleware = getExpressMiddleware({
  appName: 'frontend-mt--web-app',
  dataDogOptions: {globalTags: {node_ssr: 'motor'}, routes},
  stdoutOptions: {
    getTenantService,
    team: 'frontend-mt'
  }
})

export default () => {
  try {
    return {
      [TYPES.LOGGING]: loggingMiddleware
    }
  } catch (err) {
    console.error('[hooks] Something was really wrong', err.msg) // eslint-disable-line

    return {}
  }
}
```

Then, use can configure this hook following [`@s-ui/ssr` instructions](https://github.com/SUI-Components/sui/tree/master/packages/sui-ssr#hooks)

##### StdoutLogger

Those logs will be sent to our ELK Service.

Options:

- **`getTenantService` {Function}** - It receives the request as an argument and should return a string with matching tenant
- **`team` {String}** - It indicates the owner of that service. **It is required**, logs that does not have team property set will be ignored

##### DataDogLogger

Those logs will be sent to Datadog, using `hot-shots` library.

Options:

- **`globalTags` {Object}** - This properties will be used in `globalTags` param on `hot-shots` client creation. It should have at least this attribute `{node_ssr: 'app_name'}`
- **`routes` {import('react').ComponentType}** - React routes

#### Express middleware for sui-ssr logging hook using Reporter

`@s-ui/ssr` accepts hooks (express middlewares), one of them is for logging and we could add here our logging hook.

```js
import TYPES from '@s-ui/ssr/hooks-types'
import {logErrorsMiddleware} from '@s-ui/logger'

export default () => {
  try {
    return {
      [TYPES.LOGGING]: logErrorsMiddleware
    }
  } catch (err) {
    console.error('[hooks] Something was really wrong', err.msg) // eslint-disable-line

    return {}
  }
}
```

#### Tracking page fetching

Use `traceInitialProps` to keep track of a page fetching function using the timing method from the `logger`. If the `logger` is not defined inside the `context` of the application it will do nothing.

```js
import {traceInitialProps} from '@s-ui/logger'

function HomePage() {}

HomePage.displayName = 'HomePage'

HomePage.getInitialProps = traceInitialProps(({req, context, routeInfo}) => {
  // do something
  return {}
})

export default HomePage
```

## Consume Stdout logs

📖 Check your Logger Service

Available fields:

- `http_status_code`: for all the server requests if `getExpressMiddleware` has been implemented.
- `message`: for logged strings or errors
- `error ({message, stack})`: for caught exceptions or logged errors
- Also, accept custom fields. Just make a `console[method]` with one object parameter. For example: `console.log({message: 'my custom log', data: {value: 'sth I want to read'}})`. Be careful using large objects, we recomend `{message, data}` format.

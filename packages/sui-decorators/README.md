# sui-decorators

> Set of ES6 decorators to improve your apps

## Definition

Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality. The primary benefit of the **Decorator** pattern is that you can take a rather vanilla object and wrap it in more advanced behaviors. [Learn more](https://robdodson.me/javascript-design-patterns-decorator/)

## Installation

```sh
npm install @s-ui/decorators
```

## Available decorators

| Name                  | Description                                                                         | Link                               |
| --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------- |
| `@inlineError`        | Wrap a function to handle the errors for you.                                       | [Take me there](#inlineerror)      |
| `@AsyncInlineError()` | Wrap an async function to handle errors for you and return a tuple [error, result]. | [Take me there](#asyncinlineerror) |
| `@streamify()`        | Creates a stream of calls to any method of a class.                                 | [Take me there](#streamify)        |
| `@cache()`            | Creates a Memory or LRU cache.                                                      | [Take me there](#cache)            |
| `@tracer()`           | Sends a performance timing metric to the configured reporter.                       | [Take me there](#tracer)           |

## Reference

### @inlineError

Wrapper any function and handle the errors for you:

If the function return a promise:

- When is resolved return [null, resp]
- When is rejected return [err, null]
- When throw an exception return [err, null]

If the function is a sync function:

- When is execute return [null, resp]
- When throw an exception return [err, null]

```javascript
import {inlineError} from '@s-ui/decorators'

class Buzz {
  @inlineError
  method() {
    return Promise.reject(new Error('KO'))
  }
}

const buzz = new Buzz()
const [err, resp] = buzz.method()

console.log(typeof err) // ==> Error
```

### @AsyncInlineError()

Wrap an async function to handle errors for you and return a tuple [error, result]. This decorator is a function to enable the possibility to improve in the future with new features and keep retrocompatibility.

#### Workflow

- When the promise function is resolved return [null, resp]
- When the promise function is rejected return [err, null]
- When throw an exception return [err, null]

#### Example

```javascript
import {AsyncInlineError} from '@s-ui/decorators'

class Buzz {
  @AsyncInlineError()
  method() {
    return Promise.reject(new Error('KO'))
  }
}

const buzz = new Buzz()
const [err, resp] = buzz.method()

console.log(typeof err) // ==> Error
```

### @streamify()

Creates a stream of calls to any method of a class. _Dependency of RxJS_

```javascript
import {streamify} from '@s-ui/decorators'

@streamify('greeting', 'greetingAsync')
class Person {
  greeting(name) {
    return `Hi ${name}`
  }

  greetingAsync(name) {
    return new Promise(resolve => setTimeout(resolve, 100, `Hi ${name}`))
  }
}

const person = new Person()

person.$.greeting.subscribe(({params, result}) => {
  console.log(`method was called with ${params} and response was "${result}"`) // => method was called with ['Carlos'] and response was "Hi Carlos"
})

person.$.greetingAsync.subscribe(({params, result}) => {
  console.log(`method was called with ${params} and response was "${result}"`) // => method was called with ['Carlos'] and response was "Hi Carlos"
})

person.greeting('Carlos')
person.greetingAsync('Carlos')
```

### @cache()

There are two types of cache handlers (Memory LRU and Redis LRU):

#### Memory LRU cache

Creates a cache of calls to any method of a class, only when the response is not an error.

```javascript
import {cache} from '@s-ui/decorators'

class Dummy {
  @cache()
  syncRndNumber(num) {
    return Math.random()
  }
}
const dummy = new Dummy()

const firstCall = dummy.syncRndNumber()
const secondCall = dummy.syncRndNumber()

// => firstCall === secondCall
```

Dump cache to console if setting to truthy '**dumpCache**' key in localStorage:

```javascript
localStorage.__dumpCache__ = true
```

By default the TTL for the keys in the cache is 500ms, but it can be changed with the `ttl` option.

```javascript
import {cache} from '@s-ui/decorators'

class Dummy {
  @cache({ttl: 2000})
  syncRndNumber(num) {
    return Math.random()
  }
}
```

For this method the cache is of 2 seconds.

It is possible to set TTL using a string with the format `ttl: 'XXX [second|seconds|minute|minutes|hour|hours]'`,
thus, avoiding writing very large integers.

#### Redis LRU cache:

It creates a cache of the decorated method response of a class, only when the response is not an error.
You must decorate methods that return a promise and its resolved value is a plain javascript object, a JSON, or a simple type (number, string...).

If you are using Redis cache decorator in a [sui-domain extended project](https://github.com/SUI-Components/sui/tree/master/packages/sui-domain), you should decorate `UseCase` classes `execute` methods which are the ones returning plain JSON objects.

**Note: Redis cache only works in server side.**

```javascript
import {UseCase} from '@s-ui/domain'
import {inlineError, cache} from '@s-ui/decorators'

export class GetSeoTagsSearchUseCase extends UseCase {
  @cache({
    server: true,
    ttl: '1 minute',
    redis: {host: 'localhost', port: 6379}
  })
  @inlineError
  async execute({adSearchParamsAggregate}) {
    const [seoTagsError, seoTagsResponse] = await this._service.execute({
      adSearchParamsAggregate
    })

    if (seoTagsError) {
      return Promise.reject(seoTagsError)
    }

    return seoTagsResponse?.toJSON()
  }
}
```

#### Configuration

To have Redis cache fully working, previously a Redis server should be up and running, you must set `server` flag to `true` and provide desired `redis` server connection config: `@cache({server: true, redis: {host: YOUR_REDIS_HOST, port: YOUR_REDIS_PORT_NUMBER}})`, if one of these params is not provided redis cache won't be activated.

To do real requests against your Redis server you must set `USE_REDIS_IN_SUI_DECORATORS_CACHE` variable to `true` (`process.env.USE_REDIS_IN_SUI_DECORATORS_CACHE` in SSR).

You can add it in your web-app `config-[dev|pre|pro]` file as `USE_REDIS_IN_SUI_DECORATORS_CACHE: true`, or as you wish.
In case you want to pass tests against a real redis server you should set this variable, otherwise tests are running against a mocked redis.

This decorator will look for a `USE_VERSION_NAMESPACE_FOR_REDIS_SUI_DECORATORS_CACHE` variable in the host, `global.USE_VERSION_NAMESPACE_FOR_REDIS_SUI_DECORATORS_CACHE` in SSR. This variable will add a version tag namespace in the cache key stored in Redis, it would be helpful to avoid not cleaned cache entries for different web-app deployed versions. If it's not decalred cache entry will be stored without version namespace in the key.

#### Options:

Common for both LRU and Redis:

- ttl: Time to life for each cache register (default: `500ms`)

- server: If the cache will be used in a NodeJS env. Be careful that could break your server. You should set it to true if you are adding redis config and want to activate redis cache. (default: `false`)

- algorithm: Which algorithm will be used to discard register in the cache when will be full. For now, only `lru` available. (default: `lru`)

- size: Maximum number of registers in the cache, when they exceed this number they will be erased (default: `100`)

- cacheKeyString: String param containing cache key(it must be unique). It is useful to define a fixed cache key(constructor name + function name, e.g. `cacheKeyString: GetAdListSearchUseCase#execute`) and avoid problems with code minification. By default the following cache key will be created for `${target.constructor.name}::${fnName}` (default: `undefined`)

Only for Redis:

- redis: desired redis server connection config `@cache({server: true, redis: {host: YOUR_REDIS_HOST, port: YOUR_REDIS_PORT_NUMBER}})`. (default: `undefined`, if `redis={} -> {host: '127.0.0.1', port: 6379}`) Remember `server` flag must be true and `process.env.USE_REDIS_IN_SUI_DECORATORS_CACHE` must be setted to true to connect to the provided redis server.

#### How to disable the cache

In some cases we might want to disable the `cache` for certain environment or testing purposes. In that case, we should expose a variable into the global scope as:

```
// For client side
window.__SUI_CACHE_DISABLED__ = true

// Server side
global.__SUI_CACHE_DISABLED__ = true
```

### @tracer()

Sends a performance timing metric to the configured reporter.

```js
import {tracer} from '@s-ui/decorators'

class SomeUseCase {
    @tracer({metric: 'METRIC_1'})
    execute({input}) {
        return ...
    }
}
```

#### Configuration

This decorator will look for a `__SUI_DECORATOR_TRACER_REPORTER__` variable in the host (`window.__SUI_DECORATOR_TRACER_REPORTER__` in browser/`global.**SUI_DECORATOR_TRACER_REPORTER** in SSR).

If no reporter defined is found it will use the default `ConsoleReporter` which will output the messages in console.

Also, the tracer provides a `DataDogReporter which implements the Reporter Interface. This reporter needs a client to be
passed to the reporter constructor. In this case, we are using [hot-shots](https://github.com/brightcove/hot-shots),
which is a StatsD compatible client.

**Note: be sure to define this in a server-only executed file.**

```js
import {DataDogReporter} from '@s-ui/decorators/lib/decorators/tracer'
import StatsD from 'hot-shots'

global.__SUI_DECORATOR_TRACER_REPORTER__ = new DataDogReporter({
  client: new StatsD({
    errorHandler: error => {
      console.log('Socket errors caught here: ', error)
    },
    globalTags: {
      env: process.env.NODE_ENV,
      node_ssr: 'milanuncios',
      origin: 'server'
    }
  }),
  siteName: 'ma'
})
```

The provided `DataDogReporter` accepts a `siteName` parameter that will be appended to the metric name:
`frontend.${siteName}.tracer.datadog.reporter`, so we could look for our metric in datadog as `frontend.ma.tracer.datadog.reporter`.

#### Usage

After having the reporter configured, you need to add the `@tracer` in the useCases / methods you want to be
measured. The tracer uses the [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance).

```
import {UseCase} from '@s-ui/domain'
import {inlineError, tracer} from '@s-ui/decorators'

export class GetAdSearchParamsFromURLSearchUseCase extends UseCase {
  ...

  @tracer()
  @inlineError
  async execute({path}) {
```

The decorator accepts an optional `metric` parameter that will be sent to the reporter.

```
import {UseCase} from '@s-ui/domain'
import {inlineError, tracer} from '@s-ui/decorators'

export class GetAdSearchParamsFromURLSearchUseCase extends UseCase {
  ...

  @tracer({metric: 'get_search_params'})
  @inlineError
  async execute({path}) {
```

#### Compatibility

The `@tracer` decorator works fine with the `@inlineError` decorator, but it should be placed first:

```
  (...)

  @tracer({metric: 'metric_1'})
  @inlineError
  async execute({path}) {
  ...
```

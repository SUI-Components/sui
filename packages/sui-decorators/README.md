# sui-decorators
> Set of ES6 decorators to improve your apps

## Definition
Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality. The primary benefit of the __Decorator__ pattern is that you can take a rather vanilla object and wrap it in more advanced behaviors. [Learn more](https://robdodson.me/javascript-design-patterns-decorator/)

## Installation

```sh
npm install @s-ui/decorators
```

## Reference

### Error

Wrapper any function and handle the errors for you:

If the function return a promise:

- When is resolved return [null, resp]
- When is rejected return [err, null]
- When throw an exception return [err, null]

If the function is a sync function:

- When is execute return [null, resp]
- When throw an exception return [err, null]


```javascript
import {inlineError} from '@s-ui/decorators';

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


### @streamify

Creates a stream of calls to any method of a class. *Dependency of RxJS*

```javascript
import {streamify} from '@s-ui/decorators';

@streamify('greeting', 'greetingAsync')
class Person {
    greeting(name){
        return `Hi ${name}`;
    }

    greetingAsync(name){
        return new Promise( resolve => setTimeout(resolve, 100, `Hi ${name}`) );
    }
}

const person = new Person();

person.$.greeting.subscribe(({params, result}) => {
    console.log(`method was called with ${params} and response was "${result}"`); // => method was called with ['Carlos'] and response was "Hi Carlos"
});

person.$.greetingAsync.subscribe(({params, result}) => {
    console.log(`method was called with ${params} and response was "${result}"`); // => method was called with ['Carlos'] and response was "Hi Carlos"
});

person.greeting('Carlos');
person.greetingAsync('Carlos');
```

### @cache

Creates a cache of calls to any method of a class.

```javascript
import {cache} from '@s-ui/decorators';

class Dummy {
  @cache()
  syncRndNumber (num) { return Math.random() }
}
const dummy = new Dummy()

const firstCall = dummy.syncRndNumber()
const secondCall = dummy.syncRndNumber()

// => firstCall === secondCall
```
Dump cache to console if setting to truthy '__dumpCache__' key in localStorage:

```javascript
localStorage.__dumpCache__ = true
```

By default the TTL for the keys in the cache is 500ms, but it can be changed with the `ttl` option.

```javascript
import {cache} from '@s-ui/decorators';

class Dummy {
  @cache({ttl: 2000})
  syncRndNumber (num) { return Math.random() }
}
```

For this method the cache is of 2 seconds.

It is possible to set TTL using a string with the format `ttl: 'XXX [second|seconds|minute|minutes|hour|hours]'`,
thus, avoiding writing very large integers.

### Options:

* ttl: Time to life for each cache register (default: `500ms`)

* server: If the cache will be used in a NodeJS env. Be careful that could break your server. (default: `false`)

* algorithm: Which algorithm will be used to discard register in the cache when will be full. For now, only `lru` available. (default: `lru`)

* size: How many register can be in the cache before start to remove register. (default: `100`)

### How to disable the cache
In some cases we might want to disable the `cache` for certain environment or testing purposes. In that case, we should expose a variable into the global scope as:
```
// For client side
window.__SUI_CACHE_DISABLED__ = true

// Server side
global.__SUI_CACHE_DISABLED__ = true
```

### @tracer

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

This decorator will look for a `__SUI_DECORATOR_TRACER_REPORTER__` variable in the host (`window.__SUI_DECORATOR_TRACER_REPORTER__` in browser/`global.__SUI_DECORATOR_TRACER_REPORTER__ in SSR).

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

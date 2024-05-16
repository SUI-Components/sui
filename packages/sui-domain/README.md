# sui-domain

> Backbone for creating a domain that complains with the guidelines of Adevinta Spain

## Motivation

**sui-domain** provides:

- Avoid repeating boilerplate code by extracting some on this library.
- Enforce all to follow same rules while creating a new domain.
- A HttpFetcher to make http requests
- Set of domain objects to extend
- A utility to create an entry point

## Installation

```sh
$ npm install @s-ui/domain --save
```

## Using EntryPoint

```javascript
import {EntryPointFactory} from '@s-ui/domain'

// useCases is an object with a key with the name of the use case
// and an array with a function to import the factory and the
// useCase name as string
const useCases = {
  current_user: [() => import('./user/UseCases/factory'), 'currentUserUseCase'],
  products_search: [
    () => import('./search/UseCases/factory'),
    'productsSearchUseCase'
  ],
  real_estate_detail: [
    () => import('./detail/UseCases/factory'),
    'realEstateDetailUseCase'
  ]
}

// config could be a simple object or a more complicated
// creation like a class Config with methods to get and set
const config = {
  DETAIL_ENDPOINT: 'http://api.url.com/detail'
}

// that returns you an instantiable EntryPoint class
const EntryPoint = EntryPointFactory({config, useCases})
const domain = new EntryPoint()

// if you don't want to share the config between instances
// you could pass the config directly to the constructor
// useful if you're mutating the config for storing values
const EntryPoint = EntryPointFactory({useCases})
const domain = new EntryPoint({config})
```

### Injecting a logger to our domain

In order to increase the observability of your domain, you can pass a custom logger to your domain instance and it will be injected on each UseCase factory. Following the example of previous section:

#### How to inject the logger to your domain?

```javascript
// Logger mock example
const logger = {
  log: () => console.log('⚠️')
}

const EntryPoint = EntryPointFactory({config, useCases, logger})
const domain = new EntryPoint()
```

#### How use it on your domain?

```javascript
// Your factory file
import EmptyUseCase from './EmptyUseCase.js'

export default ({config, logger}) => new EmptyUseCase({config, logger})

// Your UseCase implementation
export default class UseCase {
  constructor({config, logger}) {
    this._config = config
    this._logger = logger
  }

  execute() {
    this._logger.log() // Logger ready to rock! 🎸
    return Promise.resolve(true)
  }
}
```

### Injecting a pde to our domain

In order to allow your domain to work with experiments and feature flags, you can pass a custom pde to your domain instance and it will be injected on each UseCase factory.

#### How to inject the pde to your domain?

```javascript
// PDE mock example
const pde = {
  isFeatureEnabled: ({featureKey}) => true,
  getVariation: ({name}) => 'experimentVariation'
}

const EntryPoint = EntryPointFactory({config, useCases, pde})
const domain = new EntryPoint()
```

#### How to use it on your domain?

```javascript
// Your factory file
import EmptyUseCase from './EmptyUseCase.js'

export default ({config, pde}) => new EmptyUseCase({config, pde})

// Your UseCase implementation
export default class UseCase {
  constructor({config, pde}) {
    this._config = config
    this._pde = pde
  }

  execute() {
    const {isActive} = this._pde.isFeatureEnabled({featureKey: 'FeatureFlagKey'})
    return isActive ? true : false
  }
}
```

## Using Fetcher

```javascript
import {FetcherFactory} from '@s-ui/domain'
import UserEntitiesFactory from '../../user/Entities/factory'
import UserValueObjectsFactory from '../../user/ValueObjects/factory'

import HTTPUserRepository from './HTTPUserRepository'

export default class UserRepositoriesFactory {
  static hTTPUserRepository = ({config}) =>
    new HTTPUserRepository({
      config,
      fetcher: FetcherFactory.httpFetcher(),
      userEntityFactory: UserEntitiesFactory.userEntity,
      emptyUserValueObjectFactory: UserValueObjectsFactory.emptyUserValueObject
    })
}
```

## Fetcher exceptions interception

Aditionally, it's possible to require a special version of the http fetcher with which is possible to intercept all errors in one single point of the application.

This feature allows to handle generic http errors in a central and unique function of the web application.

For example, this could be useful if it's needed to perform a specific action every time a `401` status code is retrieved as a result of an http request. (i.e. to redirect the user back to the login page)

### How to require the interceptable fetcher

To be able to use this feature, instead of initializing the fetcher normally, it is needed to invoke the following method of the `FetcherFactory` class:

```javascript
const fetcher = FetcherFactory.interceptableHttpFetcher()
```

The `interceptableHttpFetcher` is fully retrocompatible with the standard `httpFetcher` class, so there is no need to adapt any code before doing this change.

### Setting a function to intercept errors

Once the `interceptableHttpFetcher` has been required and is being used to perform http requests, it's possible to set a function that will be invoked every time an error occurs when performing an http request.

This is the way the callback function can be defined:

```javascript
fetcher.setErrorInterceptor({
  callback: error => {
    if (result.isAxiosError === true) {
      const statusCode = result.response.status
      // Do something...
    }
  }
})
```

## Using a domain object

```javascript
import {UseCase} from '@s-ui/domain'

export default class CurrentUserUseCase extends UseCase {
  constructor({service} = {}) {
    super()
    this._service = service
  }

  async execute() {
    const userEntity = await this._service.execute()
    return userEntity.toJSON()
  }
}
```

```javascript
import {Service} from '@s-ui/domain'

export default class CurrentUserService extends Service {
  constructor({repository} = {}) {
    super()
    this._repository = repository
  }

  async execute() {
    const userEntity = this._repository.current()
    return userEntity
  }
}
```

## Listen a useCase

`@s-ui/domain` includes a way to subscribe to every useCase execution without the need of using any kind of decorator or external dependency.

This is useful if you have side effects in a different place from where you're executing the useCase of the domain.

```js
domain
  .get('generate_search_url_search_use_case')
  .subscribe(({params, error, result}) => {
    // doSomething when the useCase generate_search_url_search_use_case is called in other place
  })
```

If you want unsubscribe any useCase execution

```js
const subscribedUseCase$ = domain
  .get('generate_search_url_search_use_case')
  .subscribe(({params, error, result}) => {
    // doSomething when the useCase generate_search_url_search_use_case is called in other place
  })

subscribedUseCase$.unsubscribe()
```

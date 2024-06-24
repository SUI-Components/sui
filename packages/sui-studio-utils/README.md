# studio-tools
> A set of sui-studio usable tools.

```sh
$ npm install @s-ui/studio-tools --save
```

# Domain builder

> Domain builder has the purpose of giving to you the possibility of mocking some of non implemented domain use cases meanwhile your team are developing them.

# How it works

### Base initialization:

```js
import { DomainBuilder } from '@s-ui/studio-tools'
import myDomain from 'domain'


const domain = DomainBuilder.extend({ myDomain }).build()

```

### Mocking use cases

> To mock an use case you need to call two functions: 'for' and 'respondWith'
>
> Let's suppose that we want to mock an use case that isn't already implemented. Its name is 'get_products':

```js
import { DomainBuilder } from '@s-ui/studio-tools'
import myDomain from 'domain'

const getProductsResponse = {
  success: ['pineapple', 'apple', 'strawberry', 'coffee']
}
const domain = DomainBuilder.extend({ myDomain }).for({useCase: 'get_products'}).respondWith(getProductsResponse).build()


// Execute the use case and check if everything works
domain.get('current_user_use_case').execute().then((products) => {
  console.log(products) // ['pineapple', 'apple', 'strawberry', 'coffee']
})
```
### Spying use cases

> You can spy a use case with the 'for' and 'respondWith' functions. This will allow you to check if the use case has been called and with which arguments. This feature is very useful in tests.

```js
import { DomainBuilder } from '@s-ui/studio-tools'
import myDomain from 'domain'
import sinon from 'sinon'

describe('when the use case is called', () => {
  it('should be able to spy on the use case', async () => {
    const spy = sinon.spy(() => {
      return ['avocado', 'banana', 'peaches', 'pisto']
    })
    const domain = DomainBuilder.extend({ myDomain })
      .for({useCase: 'get_products'})
      .respondWith({ success: spy }).build()
    const response = await domain.get('get_products').execute()
    expect(response).toEqual(['avocado', 'banana', 'peaches', 'pisto'])
    expect(spy.called).toBe(true)
  })
})
```
### Mocking the configuration

```js
DomainBuilder.extend(
  {
    domain,
    config: 'mocked-config'
  })
```

### Forcing an error throw

```js
import { DomainBuilder } from '@s-ui/studio-tools'
import myDomain from 'domain'

const getProductsError = {
  fail: 'Unexpected error :('
}
const domain = DomainBuilder.extend({ myDomain }).for({useCase: 'get_products'}).respondWith(getProductsError).build()


// Execute the use case and check if everything works
domain.get('current_user_use_case').execute().then((products) => {
  // Never will be fired
}).catch((e) => {
  console.log(e) // Unexpected error :(
})
```



> THINGS TO KEEP IN MIND: 

> You CAN'T mock a use case if already exists on the domain. This means that we can ONLY mock use cases that doesn't exist on the domain 



# I18N

> Function with the purpose of set our locales on rosseta.

# How it works
The library accepts two types of flow
1. Usecase given translations.
2. Object given translations.

### Usecase given translations:

The locales are getted using a usecase of a domain. You pass the usecase not the domain.

```js
import { i18n } from '@s-ui/studio-tools'
import myDomain from 'domain'


i18n({ literalsUseCase: myDomain.get('get_literals_from_backend') }).then((rossetaInstance) => {
  rossetaInstance.t('myLocaleName');
})



```

### Object given translations:
 
The locales are getted by an object argument. No call is done to any use case.

Dictionary should be formed with this format:

```js
    'es-ES': { // Or your iso language
      'LOGIN': 'INICIAR SESIÓN', // your locale names
      'SIGNUP': 'CREAR UNA CUENTA'
    }
```

```js
import { i18n } from '@s-ui/studio-tools'
import myDomain from 'domain'
import myLocalesDictionary from '../../utils/dictionary' // Or wherever you have your locales object.

i18n({ dictionary: myLocalesDictionary }).then((rossetaInstance) => {
  rossetaInstance.t('myLocaleName');
})

```

#### IN BOTH CASES the function returns a PROMISE.


## Configuration

The function comes with a little customization feature. You can customizate:
1. Culture - default es-ES
2. Currency - default EUR


Send custom config is as easy as put a config property on your object arguments:

```js
import { i18n } from '@s-ui/studio-tools'
import myDomain from 'domain'
import myLocalesDictionary from '../../utils/dictionary' // Or wherever you have your locales object.

i18n({
        dictionary: myLocalesDictionary,
        config: {
          currency: 'EUR',
          culture: 'es-ES'
        }
}).then((rossetaInstance) => {
  rossetaInstance.t('myLocaleName');
})

```



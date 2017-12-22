# sui-studio-tools
> A set of sui-studio usable tools.

```sh
$ npm install @s-ui/sui-studio-tools --save
```

# Domain builder

> Domain builder have the purpose of give to you the possibility of mock some of non implemented domain use cases meanwhile your team are developing them.

# How it works

### Base initialization:

```js
import { DomainBuilder } from '@s-ui/sui-studio-tools'
import myDomain from '@schibstedspain/myDomain'


const domain = DomainBuilder.extend({ myDomain }).build()

```

### Mocking use cases

> To mock use case you need to call two functions: 'for' and 'respondWith'
>
> Lets supose that we want to mock a use case that isn't already implemented. It's name is 'get_products':

```js
import { DomainBuilder } from '@s-ui/sui-studio-tools'
import myDomain from '@schibstedspain/myDomain'

const getProductsResponse = {
  success: ['pineapple', 'apple', 'strawberry', 'coffee']
}
const domain = DomainBuilder.extend({ myDomain }).for('get_products').respondWith(getProductsResponse).build()


// Execute the use case and check if everything works
domain.get('current_user_use_case').execute().then((products) => {
  console.log(products) // ['pineapple', 'apple', 'strawberry', 'coffee']
})
```


### Forcing an error throw

```js
import { DomainBuilder } from '@s-ui/sui-studio-tools'
import myDomain from '@schibstedspain/myDomain'

const getProductsError = {
  fail: 'Unexpected error :('
}
const domain = DomainBuilder.extend({ myDomain }).for('get_products').respondWith(getProductsError).build()


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
import { i18n } from '@s-ui/sui-studio-tools'
import myDomain from '@schibstedspain/myDomain'


i18n({ literalsUseCase: myDomain.get('get_literals_from_backend') }).then((rossetaInstance) => {
  rossetaInstance.t('myLocaleName');
})



```

### Object given translations:
 
The locales are getted by an object argument. No call is done to any use case.

```js
import { i18n } from '@s-ui/sui-studio-tools'
import myDomain from '@schibstedspain/myDomain'
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
import { i18n } from '@s-ui/sui-studio-tools'
import myDomain from '@schibstedspain/myDomain'
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



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

const getProductsResponse = ['pineapple', 'apple', 'strawberry', 'coffee']
const domain = DomainBuilder.extend({ myDomain }).for('get_products').respondWith(getProductsResponse).build()

domain.get('current_user_use_case').execute().then((products) => {
  console.log(products) // ['pineapple', 'apple', 'strawberry', 'coffee']
})
```

> THINGS TO KEEP IN MIND: 

> You CAN'T mock a use case if already exists on the domain. This means that we can ONLY mock use cases that doesn't exist on the domain 


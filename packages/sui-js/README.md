# sui-js
> Set of useful js utilities

```sh
$ npm install @s-ui/js --save
```

## pipe
Consist of a chain of processing functions, where the output of each element is the input of next

```js
import pipe from @s-ui/js/lib/pipe

const textToUpperCase = text => text.toUpperCase()
const textToArray = text => [...text]
const title = 'Schibsted'

console.log(pipe(textToUpperCase, textToArray)(title)) // ["S", "C", "H", "I", "B", "S", "T", "E", "D"]
```

## asyncPipe
Consist of a chain of processing async and sync functions, where the output of each element is the input of next. The result is a promise.

```js
import {asyncPipe} from @s-ui/js/lib/pipe

const textToUpperCase = async text => text.toUpperCase()
const textToArray = async text => [...text]
const title = 'Schibsted'

asyncPipe(textToUpperCase, textToArray)(title).then(result => {
  console.log(result) // ["S", "C", "H", "I", "B", "S", "T", "E", "D"]
})
```

## cookie
Parse, get and set cookies. Returns an object `cookie` with `parse`, `get` and `set` methods.

**Note:** `set` method does not work on server side.

```js
import cookie from '@s-ui/js/lib/cookie'

// Parse
const {parse} = cookie
domain.config('cookie', parse(cookies))

// Get
const {get: getCookie} = cookie
const smartBannerCookie = getCookie('smartbanner')

// Set
const {set: setCookie} = cookie
const setSmartBannerCookie = setCookie('smartbanner', 1)
```

## events
Creates an event and dispatches it

```js
import { dispatchEvent } from '@s-ui/js/lib/events'

dispatchEvent({
  eventName: 'NAME_OF_THE_EVENT_TO_DISPATCH',
  detail: {
    parameter_one: 'one',
    anotherParameter: 2
  }
})
```

## hash
Creates an insecure, but with pretty low collisions, hash based on MD5. Returns a string with the hash.

```js
import { createHash } from '@s-ui/js/lib/hash'

const stringToHash = 'This is the string that we will hash'
const md5Hash = createHash(stringToHash)

console.log(md5Hash) // f97ed77ff4770b7d8f0a018223823d3b
```

## string
A bunch of string utilities: remove accents, parse query strings...

```js
import { removeAccents, hasAccents } from '@s-ui/js/lib/string'

console.log(removeAccents('París')) // "Paris"
console.log(hasAccents('Árbol')) // true


import {parseQueryString} from '@s-ui/js/lib/string'

console.log(parseQueryString('?targetPage=pta')) // {targetPage: "pta"}
```

## ua-parser
A user agent parser. Returns an object `stats` with `isMobile` and `osName`.

```js
import {stats} from '@s-ui/js/lib/ua-parser'
const {isMobile, osName} = stats(userAgent)
domain.config('isMobile', isMobile) // bool
domain.config('osName', osName) // string
```

## classes
Utilities to easily format classNames following the current convention for component-{children}-element--modifier

```js
import {suitClass} from '@s-ui/js/lib/classes'
const baseComponent = suitClass('baseComponent')
const childrenComponent = baseComponent({children: 'childrenComponent'})

const className = childrenComponent({element: 'element', modifier: 'modifier'}) // outputs: baseComponent-childrenComponent-element--modifier
```

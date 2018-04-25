# sui-js
> Set of useful js utilities

```sh
$ npm install @s-ui/js --save
```

## ua-parser
A user agent parser. Returns an object `stats` with `isMobile` and `osName`.

```js
import {stats} from '@s-ui/js/lib/ua-parser'
const {isMobile, osName} = stats(userAgent)
domain.config('isMobile', isMobile) // bool
domain.config('osName', osName) // string
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

## string
A bunch of string utilities: remove accents, ...

```js
import { removeAccents, hasAccents } from '@s-ui/js/lib/string'

console.log(removeAccents('París')) // "Paris"
console.log(hasAccents('Árbol')) // true
```

## events
Creates an event and dispatches it

```js
import { dispatchEvent } from '@s-ui/js/lib/events'

dispatchEvent({ eventName: 'NAME_OF_THE_EVENT_TO_DISPATCH', detail: {
  parameter_one: 'one',
  anotherParameter: 2
})
```

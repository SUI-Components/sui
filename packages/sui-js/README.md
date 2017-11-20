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

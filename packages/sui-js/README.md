# sui-js
> Set of useful js utilities

```sh
$ npm install @s-ui/js --save
```

## ua-parser
A browser detector (isMobile, osName). Imports [https://github.com/lancedikson/bowser](https://github.com/lancedikson/bowser).

```js
import {stats} from '@s-ui/js/lib/ua-parser'
const {isMobile, osName} = stats(userAgent)
domain.config('isMobile', isMobile) // bool
domain.config('osName', osName) // string
```

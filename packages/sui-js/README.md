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

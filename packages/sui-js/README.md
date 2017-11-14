# sui-js
> Set of useful js utilities

```sh
$ npm install @s-ui/js --save
```

## browser
A browser detector (device, browser, OS...).
Imports [https://github.com/lancedikson/bowser](https://github.com/lancedikson/bowser).

```js
import {stats} from '@s-ui/js/lib/browser'
const {isMobile, osName} = stats(userAgent)
domain.config('isMobile', isMobile) // bool
domain.config('osName', osName) // string
```

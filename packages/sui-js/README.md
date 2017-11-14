# sui-js
> Set of useful js utilities

```sh
$ npm install @s-ui/js --save
```

## browser
A browser detector (device, browser, OS...).
Imports [https://github.com/lancedikson/bowser](https://github.com/lancedikson/bowser).


```js
import browser from '@s-ui/js/lib/browser'
const ua = browser(userAgent)
domain.config('isMobile', ua.mobile) // bool
```

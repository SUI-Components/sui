# sui-consents

> user consents handler

```sh
$ npm install @s-ui/consents
```

## hasUserConsents

Returns if a user has given its consent to a set of consents

```js
import {hasUserConsents} from '../src/index'

const cookies = (req) => {
  if (isClient) {
    return document.cookie
  }
  return req.headers.cookie
}

// will return true if user did accept at least to consents 1, 2 and 3
hasUserConsents({
  requiredConsents: [1, 2, 3],
  cookies
})
```

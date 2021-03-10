# sui-consents

> user consents handler

```sh
$ npm install @s-ui/consents
```

## hasUserConsents

Returns if a user has given its consent to a set of consents.

```js
import {hasUserConsents} from '@s-ui/consents'

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

## useUserConsents

React hook that returns whether a user has given its consent to a set of consents or not, and updates over time if the user changes the consents.

```js
import {useUserConsents} from '@s-ui/consents'

// will return true if user did accept at least to consents 1, 2 and 3
const isAccepted = useUserConsents([1, 2, 3])
```

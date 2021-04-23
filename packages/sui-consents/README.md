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

**IMPORTANT NOTE:** This hook **requires** an isomorphic **`cookies`** property to reside **in your SUIContext**. This is necessary for the initial state to work.

After initial state is set via cookies from the context, the hook will consume TCF events to keep itself updated. All this is internally managed by the hook for you.

```js
import {useUserConsents} from '@s-ui/consents'

// will return true if user did accept at least to consents 1, 2 and 3
const isAccepted = useUserConsents([1, 2, 3])
```

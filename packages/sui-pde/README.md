# sui-pde

> An adapter based tool to handle feature toggles, progressive rollouts and A/B Testing services in our products

## Installation

```sh
$ npm install @s-ui/pde
```

## Usage

### React context

Setup the tool's own react context by setting it like this:

```jsx
import {PdeContext} from '@s-ui/pde'

<PdeContext.Provider>
  // children
</PdeContext.Provider>
```

### Experiments

```js
var variation = optimizelyClientInstance.activate('web-app-use-case-1', userId);
if (variation === 'variation_1') {
  // execute code for variation_1
} else if (variation === 'variation_2') {
  // execute code for variation_2
} else {
  // execute default code
}
```

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

Given experiment `experimentX` with 2 variations `variationA` and `variationB` render `MyVariationA` or `MyVariationB` component depending on the variation the user has being assigned. Render `MyVariationA` by default

```js
import {useExperiment} from '@s-ui/pde'

const MyComponent = () => {
  const {variation} = useExperiment('experimentX')

  if (variation === 'variationB') return <MyVariationB />
  return <MyVariationA>
}
```

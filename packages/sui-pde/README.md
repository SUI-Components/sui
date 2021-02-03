# sui-pde

> An adapter based tool to handle feature toggles, progressive rollouts and A/B Testing services in our products

## Installation

```sh
$ npm install @s-ui/pde
```

## Optimizely adapter

### React context

Setup the tool's own react context in your context factory like this:

```jsx
import {PDE, PdeContext} from '@s-ui/pde'
import OptimizelyAdapter from '@s-ui/pde/lib/adapters/optimizely'

const optimizelyInstance = OptimizelyAdapter.createOptimizelyInstance({
  sdkKey: MY_API_KEY,  // optimizely sdk api key
  options // optional: https://docs.developers.optimizely.com/full-stack/docs/initialize-sdk-javascript-node
})

const optimizelyAdapter = new OptimizelyAdapter({
  optimizely: optimizelyInstance,
  userId: // mandatory
})

const pde = new PDE({
  adapter: optimizelyAdapter,
  hasUserConsents: // optional boolean, true by default
})

// app.js
<PdeContext.Provider value={{pde}}>
  // children
</PdeContext.Provider>
```

### Experiments

Given experiment `experimentX` with 2 variations `variationA` and `variationB` render `MyVariationA` or `MyVariationB` component depending on the variation the user has being assigned. Render `MyVariationA` by default

⚠️ if the user did not consent to or if optimizely decides that the user will not be part of the experiment of something goes wrong, `useExperiment` will return as variation value `default`

```js
import {useExperiment} from '@s-ui/pde'

const EXPERIMENT = 'experimentX'

const MyComponent = () => {
  const {variation} = useExperiment(EXPERIMENT)

  if (variation === 'variationB') return <MyVariationB />
  return <MyVariationA>
}
```

#### Segment integration

By default, segment integration will be active, this means that a global `window.optimizelyClientInstance` reference to the `optimizelyIntance` object passed by to the PDE constructor will be created. In case you want to turn this option off, create the optimizely adapter as follows:

```js
const optimizelyAdapter = new OptimizelyAdapter({
  optimizely: optimizelyInstance,
  userId,
  activeIntegrations: {segment: false}
})
```

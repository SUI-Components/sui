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

// all options here https://docs.developers.optimizely.com/full-stack/docs/initialize-sdk-javascript-node, but for now only 3 of them are available
const optimizelyInstance = OptimizelyAdapter.createOptimizelyInstance({
  sdkKey: MY_API_KEY,  // optimizely sdk api key
  options // optional, datafileOptions
  datafile: // optional
})

const optimizelyAdapter = new OptimizelyAdapter({
  optimizely: optimizelyInstance,
  userId: // mandatory,
  hasUserConsents  // if false, the user won't be part of the A/B test
})

const pde = new PDE({
  adapter: optimizelyAdapter,
  hasUserConsents: true // Kept because of legacy reasons, pass it by the OptimizelyAdapter constructor
})

// app.js
<PdeContext.Provider value={{pde}}>
  // children
</PdeContext.Provider>
```

#### SSR considerations

When client-side rendering, sui-pde will load the datafile saved as `window.__INITIAL_CONTEXT_VALUE__.pde` as initial datafile. Therefore, you'll need to inject the output of the `pde.getInitialContextData()` function in your html when server side rendering.

### Experiments

Given experiment `experimentX` with 2 variations `variationA` and `variationB` render `MyVariationA` or `MyVariationB` component depending on the variation the user has being assigned. Render `MyVariationA` by default

⚠️ If the user did not consent to or if optimizely decides that the user will not be part of the experiment of something goes wrong, `useExperiment` will return as variation value `null`

⚠️ The `useExperiment` hook will send call a global window.analytics.track method with `Experiment Viewed` as event name with the experiment properties so you are able to replicate the experiment in your analytics tool

```js
import {useExperiment} from '@s-ui/pde'

const EXPERIMENT_NAME = 'experimentX'

const MyComponent = () => {
  const {variation} = useExperiment({experimentName: EXPERIMENT_NAME})

  if (variation === 'variationB') return <MyVariationB />
  return <MyVariationA>
}
```

**Special cases for useExperiment `Experiment Viewed` track**

Given useExperiment sends `Experiment Viewed` on being executed, some facts could happen:

- Root: Analytics SDK is loaded async and loads after useExperiment hook has been called
Cause: `Experiment Viewed` won't be sent.

- Root: `Experiment Viewed` should has a different name or properties.
Cause: Send a track with wrong values.

In order to have a higher controll about that, useExperiment accepts a `browserTrackExperiment` callback to customize it

```js
import {useExperiment} from '@s-ui/pde'

const EXPERIMENT_NAME = 'experimentX'

const trackExperiment = () => {
  window.analytics.track('Experiment Viewed', {
      experimentName,
      variationName,
      customProperty: 'yay'
    })
}

const MyComponent = () => {
  const {variation} = useExperiment({
    experimentName: EXPERIMENT_NAME,
    browserTrackExperiment: trackExperiment
  })

  if (variation === 'variationB') return <MyVariationB />
  return <MyVariationA>
}
```

### Feature Flags

⚠️ user consents do not apply to feature flags

```js
import  {useFeature} from '@s-ui/pde'

const MyComponent = () => {
  const {isActive} = useFeature('myFeatureKey') // isActive = true when the feature flag is activated

  return <p>The feature 'myFeatureKey' is {isActive ? 'active' : 'inactive'}</p>
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

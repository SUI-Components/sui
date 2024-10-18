# sui-pde

> An adapter based tool to handle feature toggles, progressive rollouts and A/B Testing services in our products

## Installation

```sh
$ npm install @s-ui/pde
```

## About

This is a tool that abstracts from:

- PDE tools like Optimizely, Houston, Target, Unleash, ...
- Integration with third party analytics tools like Segment
- User id management
- User consents management
- Common audiences and segments

In order to abstract from progressive delivery and experimentation (PDE) tools like Optimizely, sui-pde provides a JS class which requires an adapter that connects directly to one of those tools. We did implement the Optimizely Full Stack adapter.

## Optimizely adapter

### React context

Setup the tool's own react context in your context factory like this:

```jsx
import {PDE, PdeContext} from '@s-ui/pde'
import OptimizelyAdapter from '@s-ui/pde/lib/adapters/optimizely'

// all options here https://docs.developers.optimizely.com/full-stack/docs/initialize-sdk-javascript-node, but for now only 3 of them are available
const optimizelyInstance = OptimizelyAdapter.createOptimizelyInstance({
  sdkKey: MY_API_KEY,  // optimizely sdk api key
  options, // optional, datafileOptions
  datafile // optional
})

const optimizelyAdapter = new OptimizelyAdapter({
  optimizely: optimizelyInstance,
  userId: // mandatory,
  hasUserConsents,  // if false, the user won't be part of the A/B test,
  applicationAttributes: {   // optional, global application attributes that must be send on every experiment activation
    site: 'coches.net',
    environment: 'development'
  }
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

### Feature Test

Feature tests are similar to A/B/n tests that allow you to control whether for each variation the associated feature is on or off via feature flags (aka feature toggles). It also allows you to control the feature variable values for the various variables associated with the feature.

The `useDecision` hook retrieves the result for a given decision, based on logic from the decision-making tool you are using (e.g., Optimizely).

```js
import {useDecision} from '@s-ui/pde'

function Component() {
  const decision = useDecision('feature_test', {})

  return (
    <>
      {decision.enabled && <p>My feature is enabled</p>}
      {!decision.enabled && <p>My feature is disabled</p>}
      {decision.variationKey === 'variantion_a' && <p>Current Variation</p>}
      {decision.variationKey === 'variantion_b' && <p>Better Variation</p>}
    </>
  );
}
```

You can also use the `Decision` component:

```js
import {Decision} from '@s-ui/pde'

const MyComponent = () => {
  return (
    <Decision name="feature_test">
      {({enabled}) => enabled ? <p>My feature is enabled</p> : <p>My feature is disabled</p>}
    </Decision>
  )
}
```

#### Attributes

You can pass additional attributes to refine your decision logic:

```js
import {useDecision} from '@s-ui/pde'

const MyComponent = () => {
  const {enabled, variationKey} = useDecision('feature_test', {
    attributes: {
      isLoggedIn: true
    }
  })
}
```

#### Forcing a decision

You can force specific decision outcomes during testing by adding a query parameter.

- `http://www.fotocasa.es/es?suipde_example=on` will enable the `example` feature test
- `http://www.fotocasa.es/es?suipde_example=off` will disable the `example` feature test
- `http://www.fotocasa.es/es?suipde_example=variation_a` will enable the `example` feature test and will force the variation `variation_a`
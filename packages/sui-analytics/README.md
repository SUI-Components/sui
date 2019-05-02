# sui-analytics

## Description

This package adds an abstraction layer on top of [segment.com](https://segment.com/)'s [javascript library](https://segment.com/docs/sources/website/analytics.js/)

## Usage

After adding your Segment script into your html ([SPA](https://github.com/segmentio/analytics-react#%EF%B8%8F-step-1-copy-the-snippet) / [Monolith](https://segment.com/docs/sources/website/analytics.js/quickstart/) docs), sui analytics will wait for it to completely load calling the `suiAnalytics.ready` promise. Once Segment's library is wrapped, the ready promise will resolve as an object with the tracking API described [here](#methods)

```js
import suiAnalytics from '@s-ui/sui-analytics'

suiAnalytics.ready()
  .then(analytics => window.suiAnalytics = analytics)
```

After this, you will be able to track your events

## Events

### Identify - [docs](https://segment.com/docs/spec/identify/)

```js
window.suiAnalytics.identify('97980cfea0067', {
  name: 'Peter Gibbons',
  email: 'peter@initech.com',
  plan: 'premium',
  logins: 5
})
```

### Page - [docs](https://segment.com/docs/spec/page/)

```js
window.suiAnalytics.page('Home')
```

### Track - [docs](https://segment.com/docs/spec/track/)

```js
window.suiAnalytics.track('Registered', {
  plan: 'Pro Annual',
  accountType: 'Facebook'
})
```

### Reset - [docs](https://segment.com/docs/sources/website/analytics.js/#reset-logout)

```js
window.suiAnalytics.reset()
```

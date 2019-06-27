# sui-analytics

## Description

This package adds an abstraction layer on top of [segment.com](https://segment.com/)'s [javascript library](https://segment.com/docs/sources/website/analytics.js/)

## Usage

After adding your Segment snippet into your html, you'll need to include this package in order to be able to fire events.

sui-analytics will be an object with the methods described [here](#events)

### In your html page ([SPA](https://github.com/segmentio/analytics-react#%EF%B8%8F-step-1-copy-the-snippet) / [Monolith](https://segment.com/docs/sources/website/analytics.js/quickstart/) docs)

```html
<script type="text/javascript">
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";

  analytics.load("YOUR_WRITE_KEY");  // your write key must be set here
  }}();
</script>
````

### In your javascript

```js
import suiAnalytics from '@s-ui/analytics'
```

## Events

### Identify - [docs](https://segment.com/docs/spec/identify/)

```js
suiAnalytics.identify('97980cfea0067', {
  name: 'Peter Gibbons',
  email: 'peter@initech.com',
  plan: 'premium',
  logins: 5
})
```

### Track - [docs](https://segment.com/docs/spec/track/)

```js
suiAnalytics.track('Registered', {
  plan: 'Pro Annual',
  accountType: 'Facebook'
})
```

### Reset - [docs](https://segment.com/docs/sources/website/analytics.js/#reset-logout)

```js
suiAnalytics.reset()
```

# Segment Wrapper

This package adds an abstraction layer on top of [segment.com](https://segment.com/)'s [JavaScript library](https://segment.com/docs/sources/website/analytics.js/) with some useful integrations and fixes:

**Data Quality 📈**

- [x] Add `page` method that internally uses `track` but with the correct `referrer` property.
- [x] Send `user.id` and `anonymousId` on every track.
- [x] Send anonymous data to AWS to be able to check data integrity with Adobe.

**Google Analytics 🔍**

- [x] Load GA4 if `googleAnalyticsMeasurementId` is provided.
- [x] Retrieve `clientId` and `sessionId` automatically from GA4 and put in Segment tracks.

**Adobe Marketing Cloud Visitor Id ☁️**

- [x] Load _Adobe Visitor API_ when needed (if flag `importAdobeVisitorId` is set to `true`, otherwise you should load `Visitor API` by your own to get the `mcvid`).
- [x] Fetch `marketingCloudVisitorId` and put in integrations object for every track.
- [x] Monkey patch `track` native Segment method to send `marketingCloudVisitorId` inside `context.integrations`.

**Consent Management Platform 🐾**

- [x] Automatic tracking of Consent Management Platform usage.
- [x] Send `gdpr_privacy` on `context` for for all tracking events. Expect values: `unknown`, `accepted` and `declined`.
- [x] Send `gdpr_privacy_advertising` on `context` for for all tracking events. Expect values: `unknown`, `accepted` and `declined`.
- [x] `gdpr_privacy` is accepted when consents [1, 8, 10] are accepted and `gdpr_privacy_advertising` is accepted when consents [3] is accepted.
- [x] Any track is sent if the user has not accepted/rejected any consent yet.

**Developer Experience 👩‍💻**

- [x] Always send `platform` property as `web`.
- [x] Allow to configure `window.__mpi.defaultContext` to send these properties on all tracks inside the context object.
- [x] Allow to configure `window.__mpi.defaultProperties` to send these properties on all tracks.

**Segment Middlewares 🖖**

- [x] Optimizely Full Stack middleware to use Segment's anonymousId as Optimizely's userId, more info [here](#optimizelys-userid).

## Usage

After adding your Segment snippet into your html, you'll need to include this package in order to be able to fire events.

`analytics` will be an object with the methods described [here](#events).

### Step 1: Copy the Snippet in your HTML

```html
<script>
  !(function () {
    var analytics = (window.analytics = window.analytics || [])
    if (!analytics.initialize)
      if (analytics.invoked) window.console && console.error && console.error('Segment snippet included twice.')
      else {
        analytics.invoked = !0
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on',
          'addSourceMiddleware',
          'addIntegrationMiddleware',
          'setAnonymousId',
          'addDestinationMiddleware'
        ]
        analytics.factory = function (e) {
          return function () {
            var t = Array.prototype.slice.call(arguments)
            t.unshift(e)
            analytics.push(t)
            return analytics
          }
        }
        for (var e = 0; e < analytics.methods.length; e++) {
          var key = analytics.methods[e]
          analytics[key] = analytics.factory(key)
        }
        analytics.load = function (key, e) {
          var t = document.createElement('script')
          t.type = 'text/javascript'
          t.async = !0
          t.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js'
          var n = document.getElementsByTagName('script')[0]
          n.parentNode.insertBefore(t, n)
          analytics._loadOptions = e
        }
        analytics._writeKey = 'YOUR_WRITE_KEY'
        analytics.SNIPPET_VERSION = '4.13.2'

        analytics.load('YOUR_WRITE_KEY') // your write key must be set here
      }
  })()
</script>
```

### Step 2: Use

#### In your modern and beautiful JavaScript...

```js
import analytics from '@s-ui/segment-wrapper'
```

### In your monolithic JavaScript...

```js
// First load the UMD module.
<script src="https://unpkg.com/@s-ui/segment-wrapper/umd/index.js"></script>
<script>
  // Then trigger all the events you need referencing the right namespaced
  // object: `window.sui.analytics`. For more info see the "Events" section below.
  window.sui.analytics.identify('your user id', {});
  window.sui.analytics.track('your event', {});
  window.sui.analytics.reset();
</script>
```

### Step 3: Configure mandatory Segment Wrapper attributes:

The following configuration parameters are required and must be set for the system to function correctly:

- `ADOBE_ORG_ID`: This parameter is the Adobe Organization ID, required for integration with Adobe services. Please make sure that you replace the example value with your actual Adobe Org ID.
- `TRACKING_SERVER`: This specifies the tracking server URL that will be used for sending data and handling tracking requests.

  These parameters need to be defined in the `window._SEGMENT_WRAPPER` object as follows:

```js
window.__SEGMENT_WRAPPER = {
  ADOBE_ORG_ID: '012345678@AdobeOrg', // Mandatory!
  TRACKING_SERVER: 'mycompany.test.net' // Mandatory!
}
```

Configure both values correctly before running the application to ensure proper tracking and data integration.

### Step 4: Configure Segment Wrapper (optional)

You could put a special config in a the `window.__mpi` to change some behaviour of the wrapper. This config MUST somewhere before using the Segment Wrapper.

- `googleAnalyticsMeasurementId`: _(optional)_ If set, this value will be used for the Google Analytics Measurement API. It will load `gtag` to get the client id.
- `googleAnalyticsConfig`: _(optional)_ If set, this config will be passed when initializing the Google Analytics Measurement API.
- `googleAnalyticsInitEvent`: _(optional)_ If set, an event will be sent in order to initialize all the Google Analytics data.
- `defaultContext`: _(optional)_ If set, properties will be merged and sent with every `track` and `page` in the **context object**. It's the ideal place to put the `site` and `vertical` info to make sure that static info will be sent along with all the tracking.
- `defaultProperties`: _(optional)_ If set, properties will be merged and sent with every `track` and `page`.
- `getCustomAdobeVisitorId`: _(optional)_ If set, the output of this function will be used as `marketingCloudVisitorId` in Adobe Analytics' integration. It must return a promise.
- `importAdobeVisitorId` _(optional)_ If set and `true`, Adobe Visitor API will be fetched from Segment Wrapper instead of relying on being loaded before from Tealium or other services. Right now, by default, this is `false` but in the next major this configuration will be `true` by default. If `getCustomAdobeVisitorId` is being used this will be ignored.
- `tcfTrackDefaultProperties` _(optional)_ If set, this property will be merged together with the default properties set to send with every tcf track event
- `universalId`: _(optional)_ If set this value will be used for the Visitor API and other services.
- `hashedUserEmail`: _(optional)_ If set and not `universalId` is set this value will be used for the Visitor API and other services.
- `userEmail`: _(optional)_ If set and not `universalId` is available, this value will be hashed with SHA-256 and used for the Visitor API and other services.
- `isUserTraitsEnabled`: _(optional)_ If set context traits will be populated with all user traits.

Example:

```js
  window.__mpi = {
    segmentWrapper: {
      googleAnalyticsMeasurementId: 'GA-123456789',
      universalId: '7ab9ddf3281d5d5458a29e8b3ae2864',
      defaultContext: {
        site: 'comprocasa',
        vertical: 'realestate'
      },
      getCustomAdobeVisitorId: () => {
        const visitorId = // get your visitorId
        return Promise.resolve(visitorId)
      },
      tcfTrackDefaultProperties: {
        tcfSpecialProp: 'anyvalue'
      }
    }
  }
```

### It also provides additional information such as:

- window.\_\_mpi.isFirstVisit: boolean - true if the user hasn't interacted with the tcf modal yet

## Events

### Track - [docs](https://segment.com/docs/spec/track/)

```js
import analytics from '@s-ui/segment-wrapper'

analytics.track('CTA Clicked')

analytics.track('Registered', {
  plan: 'Pro Annual',
  accountType: 'Facebook'
})
```

### Page

Internally uses `Track` but changes the `referrer` everytime is called.

```js
import analytics from '@s-ui/segment-wrapper'

analytics.page('Home Viewed')

analytics.page('List Viewed', {
  property: 'HOUSE',
  transaction: 'SELL'
})
```

### Identify - [docs](https://segment.com/docs/spec/identify/)

```js
import analytics from '@s-ui/segment-wrapper'

analytics.identify('97980cfea0067', {
  name: 'Peter Gibbons',
  email: 'peter@initech.com',
  plan: 'premium',
  logins: 5
})
```

### Reset - [docs](https://segment.com/docs/sources/website/analytics.js/#reset-logout)

```js
import analytics from '@s-ui/segment-wrapper'

analytics.reset()
```

## UniversalID

_Segment Wrapper_ is handling all about the UniversalID, an ID to identify the user across different sites by using a hashed email. If you want, you could subscribe yourself to an event in order to retrieve this info:

```js
document.addEventListener(USER_DATA_READY_EVENT, e => {
  const {universalId} = e.detail
})
```

Also, you could check directly if the `universalId` is already available on the window:

```js
const {universalId} = window.__mpi.segmentWrapper
```

Or use both systems:

```js
let {universalId, universalIdInitialized} = window.__mpi.segmentWrapper

if (!universalId && !universalIdInitialized) {
  document.addEventListener(USER_DATA_READY_EVENT, e => {
    universalId = e.detail.universalId
    doSomethingWithUniversalId(universalId)
  })
}

console.log(universalId)
```

### Send xandrId as externalIds

To not send the `xandrId` put this flag as configuration: `window.__mpi.segmentWrapper.sendXandrId = false`

By default, all xandrId will be sent.

## Middlewares

You can find info about segment's middleware [here](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/middleware/)

### Optimizely's userId

Will use segment's anonymousId as optimizely's userId

#### How to

```js
import {optimizelyUserId} from '@s-ui/segment-wrapper/lib/middlewares/source/optimizelyUserId'

window.analytics.ready(() => {
  window.analytics.addSourceMiddleware(optimizelyUserId)
})
```

### Optimizely's site attribute

Will add the site property as optimizely attribute

#### How to

```js
import {optimizelySiteAttributeMiddleware} from '@s-ui/segment-wrapper/lib/middlewares/destination/optimizelySiteAttribute'

window.analytics.ready(() => {
  window.analytics.addDestinationMiddleware('Optimizely', [optimizelySiteAttributeMiddleware])
})
```

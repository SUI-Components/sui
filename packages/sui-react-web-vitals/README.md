# @s-ui/react-web-vitals

> Track the performance of pages using Core Web Vitals in real-time for all the visits

## Installation

```sh
npm install @s-ui/react-web-vitals
```

## Setup

Wrap your app component with the exported one

```jsx
import WebVitalsReporter from '@s-ui/react-web-vitals'

export default function App() {
  return (
    <WebVitalsReporter>
      <main />
    </WebVitalsReporter>
  )
}
```

In order to work properly the `App` component should be wrapped by [SUI Context](https://github.com/SUI-Components/sui/tree/master/packages/sui-react-context) and [SUI Router](https://github.com/SUI-Components/sui/tree/master/packages/sui-react-router) providers

```jsx
import withAllContexts from '@s-ui/hoc/lib/withAllContexts'
import {Router} from '@s-ui/react-router'

const context = {}
const Root = withAllContexts(context)(Router)

ReactDOM.render(<Root />, document.getElementById('root'))
```

### Logging

#### Logger

By default the metrics will be sent using the `timing` method of the `logger`. The logger should be provided by the SUI Context.

```js
import withAllContexts from '@s-ui/hoc/lib/withAllContexts'
import {Router} from '@s-ui/react-router'

const logger = new Logger() // your custom logger
const context = {logger}
const Root = withAllContexts(context)(Router)

ReactDOM.render(<Root />, document.getElementById('root'))
```

The `distribution` method from the `logger` will be called with an object that follows the next schema

```json
{
  "name": "cwv",
  "amount": 10,
  "tags": [
    {
      "key": "name",
      "value": "CLS"
    }
    {
      "key": "pathname",
      "value": "/products/:id"
    },
    {
      "key": "type",
      "value": "desktop"
    }
  ]
}
```

#### Custom

If `onReport` callback prop is set instead of reporting the metrics to the `logger` the callback will be used.

```jsx
import WebVitalsReporter from '@s-ui/react-web-vitals'

export default function App() {
  const handleReport = metric => {
    console.log(metric) // do something
  }

  return (
    <WebVitalsReporter onReport={handleReport}>
      <main />
    </WebVitalsReporter>
  )
}
```

The callback will be called with an object that follows the next schema

```json
{
  "name": "LCP",
  "amount": 10,
  "pathname": "/products/:id",
  "type": "desktop"
}
```

#### Metrics

Use `metrics` prop to set the core web vitals that you want to track. Choose between: `TTFB`, `LCP`, `FID`, `CLS` and `INP`. If not set all core web vitals will be tracked

```jsx
import WebVitalsReporter from '@s-ui/react-web-vitals'

export default function App() {
  return (
    <WebVitalsReporter metrics={['LCP', 'CLS']}>
      <main />
    </WebVitalsReporter>
  )
}
```

#### Device type

Use `deviceType` prop to set the device type that will be send when a metric is reported. Choose between: `desktop`, `tablet` and `mobile`. If not set the `browser` property from the SUI Context will be used

```jsx
import WebVitalsReporter from '@s-ui/react-web-vitals'

export default function App() {
  return (
    <WebVitalsReporter deviceType="desktop">
      <main />
    </WebVitalsReporter>
  )
}
```

#### Allowed routes

Use `allowed` prop if you only want to track a set of pathnames or route ids

```jsx
import WebVitalsReporter from '@s-ui/react-web-vitals'

export default function App() {
  return (
    <WebVitalsReporter allowed={['/products/:id', 'search']}>
      <main />
    </WebVitalsReporter>
  )
}
```

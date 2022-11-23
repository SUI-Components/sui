# @s-ui/react-web-vitals

> Track the performance of pages using Core Web Vitals

## Installation

```sh
npm install @s-ui/react-web-vitals
```

## Setup

Wrap your app component with the exported one

```jsx
import WebVitalsTracker from '@s-ui/react-web-vitals'

export default function App() {
  return (
    <CoreWebVitals>
      <main />
    </CoreWebVitals>
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

By default the metrics will be sent using the `timing` metric of the `logger`. The logger should be provided by the SUI Context.

```js
import withAllContexts from '@s-ui/hoc/lib/withAllContexts'
import {Router} from '@s-ui/react-router'

const logger = new Logger() // your custom logger
const context = {logger}
const Root = withAllContexts(context)(Router)

ReactDOM.render(<Root />, document.getElementById('root'))
```

The `timing` method from the `logger` will be called with an object that follows the next schema

```json
{
  "name": "LCP",
  "amount": 10,
  "tags": [
    {
      "key": "pathname",
      "value": "/products/:id"
    }
  ]
}
```

#### Custom

If `onReport` callback prop is set instead of reporting the metrics to the `logger` the callback will be used.

```jsx
import WebVitalsTracker from '@s-ui/react-web-vitals'

export default function App() {
  const handleReport = metric => {
    console.log(metric) // do something
  }

  return (
    <CoreWebVitals onReport={handleReport}>
      <main />
    </CoreWebVitals>
  )
}
```

The callback will be called with an object that follows the next schema

```json
{
  "name": "LCP",
  "amount": 10,
  "pathname": "/products/:id"
}
```

#### Allowed pathnames

Use `pathnames` prop if you only want to track a set of pathnames

```jsx
import WebVitalsTracker from '@s-ui/react-web-vitals'

export default function App() {
  return (
    <CoreWebVitals pathnames={['/products/:id']}>
      <main />
    </CoreWebVitals>
  )
}
```

# sui-react-initial-props

> Make your React pages to get initial props asynchronously both client and server

## Motivation

**sui-react-initial-props** offers a way to make your easily your app isomorphic.

- Offers same parameters for your getInitialProps in the client in the server to make your app 100% universal.
- Avoid re-renders as other options like React-Transmit causing a longer time to respond, specially in the server.
- Minimal footprint by focusing on the really need stuf.

![example]

## Usage

```js
import loadPage from '@s-ui/react-initial-props/lib/loadPage'

// Optional logger for error handling
const logger = {
  error: (message, error) => {
    console.error(message, error)
    // Send to your logging service
  }
}

// use the loadPage from the sui-react-initial-props
const loadHomePage = loadPage(
  () => import(/* webpackChunkName: "HomePage" */ './pages/Home'),
  logger // optional: for server-side error logging
)

export default (
  <Route>
    <Route path='/:lang' component={loadHomePage}>
  </Route>
)
```

```js
// server - isomorphic middleware

import {
  createServerContextFactoryParams,
  ssrComponentWithInitialProps
} from '@s-ui/react-initial-props'

function isomorphic (req, res, next) {
contextFactory(
  createServerContextFactoryParams(req) // pass the request to create the context
).then(context => {
  match({routes, location: req.url}, function (error, redirectLocation, renderProps = false) {
    const Target = (props) => <div>{props.fromInitialProps}</div>
    ssrComponentWithInitialProps({ context, renderProps, Target })
      .then(({ initialProps, reactString, performance }) => {
        // you have here the initialProps retrieved from the page in case you need it
        console.log('Time spent resolving the getInitialProps method', performance.getInitialProps)
        console.log('Time spent rendering the react tree', performance.renderToString)
        res.send(reactString)
      })
  }
```

```js
universal - react page component

const Page = (props) => {
  useEffect(()=> {
    // If defined previously as seen below, access __HTTP__ object as follows:
    const {initialContent, __HTTP__} = props
    const {redirectTo} = __HTTP__
    window.location.href = redirectTo
  })

  return (
    <div>
      <h1>This is the page</h1>
      <p>{initialContent}</p>
    </div>
  )
}

Page.getInitialProps = ({ context, routeInfo }) =>
  Promise.resolve({
    initialContent: 'This is the initial content',
    // Optional __HTTP__ object to perform 301 Redirects
    __HTTP__: {
      redirectTo: 'https://<301 Redirect Route>',
      // Optional object to set an Http-Cookie before redirection
      httpCookie: {
        AdNotAvailable: true
      },
      // Optional Array of ojects to set a response headers before redirection
      headers: [{'Cache-Control': 'no-store, max-age=0'}]
    }
  })
/**
 * Determine if Page should be kept while navigating on client between routes for the same page.
 * If `true`, while getting intial props on client, the component will receive a `isLoading` prop.
 * If `false`, a `renderLoading` method could be used in order to render a placeholder while loading.
 * If no value is provided, `false` is used.
**/
Page.keepMounted = true

/**
 * This could be used only in case you are using `keepMounted` with a false value.
 * This will be rendered while fetching getInitialProps on the client.
**/
Page.renderLoading = () => <h1>Loading...</h1>
```

## Installation

```sh
npm install @s-ui/react-initial-props --save
```

## API Reference

#### createClientContextFactoryParams()

Create the params for the contextFactory on the client

##### Response

| Field     | Type      | Description                                                   |
| --------- | --------- | ------------------------------------------------------------- |
| cookies   | `string`  | All the cookies of the user                                   |
| isClient  | `boolean` | Useful to know in your contextFactory if you're in the client |
| pathName  | `string`  | Current path of the url requested                             |
| userAgent | `string`  | Information of the browser, device and version in raw         |

#### createServerContextFactoryParams({ req })

Create the params for the contextFactory on the server

##### Params

| Field | Type     | Description                                                                                                                                            |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| req   | `object` | [Native Node Incoming Message](https://nodejs.org/api/http.html#http_class_http_incomingmessage) with any customized property added on your middleware |

##### Response

| Field     | Type      | Description                                                                                                                                            |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cookies   | `string`  | All the cookies of the user                                                                                                                            |
| isClient  | `boolean` | Useful to know in your contextFactory if you're in the client                                                                                          |
| pathName  | `string`  | Current path of the url requested                                                                                                                      |
| req       | `object`  | [Native Node Incoming Message](https://nodejs.org/api/http.html#http_class_http_incomingmessage) with any customized property added on your middleware |
| userAgent | `string`  | Information of the browser, device and version in raw                                                                                                  |

#### ssrComponentWithInitialProps({ Target, context, renderProps })

This method, retrieves the component page with the `getInitialProps` method, executes the async method and when it receives the info, then render to a string using the `Target` component and passing down the `context`.

##### Params

| Field       | Type            | Description                                                                                  |
| ----------- | --------------- | -------------------------------------------------------------------------------------------- |
| Target      | `React Element` | React Element to be used for passing the context and render the app on it.                   |
| context     |  `object`       | Context to be passed to the Target component and to the `getInitialProps`                    |
| renderProps | `object`        | Props used by React Router with some useful info. We're extracting the pageComponent from it |

##### Response

The response is a promise resolved with two parameters. In addition, you can define an optional `__HTTP__` object in `initialProps` to allow server side redirects using SUI-SSR:

| Field                 | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initialProps          | `object` | Result of executing the `getInitialProps` of the pageComponent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| initialprops.**HTTP** | `object` | An optional object containing a `redirectTo` key where an url might be included to allow 3XX server side redirects using [sui-ssr]. By default, redirect status code is 301, but you may set a valid `redirectStatusCode` option set in the file `@s-ui/ssr/status-codes`, an optional `httpCookie` key where you will define an object with the key/value of the `Http-Cookie` to be set from server and an optional `headers` key array of objects where you will define a custom response headers (see https://github.com/SUI-Components/sui/tree/master/packages/sui-ssr) |
| reactString           | `string` | String with the renderized app ready to be sent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### loadPage(importPage, logger?)

Load the page asynchronously by using React Router and resolving the getInitialProps. On the client it prepare the component to show the `renderLoading` (if specified) of the component. On the server, it wraps `getInitialProps` execution in a try-catch block to prevent crashes.

##### Params

| Field      | Type                | Description                                                                                                |
| ---------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| importPage | `function`          | Import the chunk of the page                                                                               |
| logger     | `object` (optional) | Optional logger object with an `error(message: string, error: Error)` method for server-side error logging |

##### Error Handling

When `getInitialProps` throws an error on the server:

- The error is caught, logged using the provided `logger` (if available), and then **re-thrown**.
- This allows the server's global error handling middleware to catch the exception and manage the response accordingly (e.g., render a 500 page), preventing the SSR process from crashing silently.

Example logger implementation:

```js
const logger = {
  error: (message, error) => {
    console.error(message, error)
    // Send to Sentry, DataDog, etc.
  }
}
```

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

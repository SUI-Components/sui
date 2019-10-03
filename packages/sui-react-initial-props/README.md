# sui-react-initial-props
> Make your React pages to get initial props asynchronously both client and server

## Motivation

**sui-react-initial-props** offers a way to make your easily your app isomorphic.
* Offers same parameters for your getInitialProps in the client in the server to make your app 100% universal.
* Avoid re-renders as other options like React-Transmit causing a longer time to respond, specially in the server.
* Minimal footprint by focusing on the really need stuf.

![example]

## Usage

```js
// React Router routes
import loadPage from '@s-ui/react-initial-props/lib/loadPage'

// context factory has to return a promise and it will be passed to the context of your components
// as well as a param to the getInitialProps
const contextFactory = ({ cookies, isClient, pathName, req = {}, userAgent }) => {
  return Promise.resolve({
    isHome: pathName === 'es',
    isLogged: cookies['user-is-logged'],
    isMobile: userAgent.includes('Android')
  })
}

// use the loadPage from the sui-react-initial-props
const loadHomePage = loadPage(contextFactory,
  () => import(/* webpackChunkName: "HomePage" */ './pages/Home')
)

export default (
  <Route>
    <Route path='/:lang' component={loadHomePage}>
  </Route>
)
```

```js
// universal - React Router routes
import loadPage from '@s-ui/react-initial-props/lib/loadPage'

// context factory has to return a promise and it will be passed to the context of your components
// as well as a param to the getInitialProps
const contextFactory = ({ cookies, isClient, pathName, req = {}, userAgent }) => {
  return Promise.resolve({
    isHome: pathName === 'es',
    isLogged: cookies['user-is-logged'],
    isMobile: userAgent.includes('Android')
  })
}

// use the loadPage from the sui-react-initial-props
const loadHomePage = loadPage(contextFactory,
  () => import(/* webpackChunkName: "HomePage" */ './pages/Home')
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

const Placeholder = () => <h1>Loading...</h1>
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


Page.renderLoading = () => <Placeholder />
Page.getInitialProps = ({ context, routeInfo }) =>
  Promise.resolve({
    initialContent: 'This is the initial content',
    // Optional __HTTP__ object to perform 301 Redirects
    __HTTP__: {redirectTo: 'https://<301 Redirect Route>'}
  })
```

## Installation

```sh
npm install @schibstedspain/react-initial-props --save
```

## API Reference

#### createClientContextFactoryParams()

Create the params for the contextFactory on the client

##### Response

Field | Type | Description
--- | --- | ---
cookies | `string` | All the cookies of the user
isClient | `boolean` | Useful to know in your contextFactory if you're in the client
pathName | `string` | Current path of the url requested
userAgent | `string` | Information of the browser, device and version in raw

#### createServerContextFactoryParams({ req })

Create the params for the contextFactory on the server

##### Params

Field | Type | Description
--- | --- | ---
req | `object` | [Native Node Incoming Message](https://nodejs.org/api/http.html#http_class_http_incomingmessage) with any customized property added on your middleware

##### Response

Field | Type | Description
--- | --- | ---
cookies | `string` | All the cookies of the user
isClient | `boolean` | Useful to know in your contextFactory if you're in the client
pathName | `string` | Current path of the url requested
req | `object` | [Native Node Incoming Message](https://nodejs.org/api/http.html#http_class_http_incomingmessage) with any customized property added on your middleware
userAgent | `string` | Information of the browser, device and version in raw

#### ssrComponentWithInitialProps({ Target, context, renderProps })

This method, retrieves the component page with the `getInitialProps` method, executes the async method and when it receives the info, then render to a string using the `Target` component and passing down the `context`.

##### Params

Field | Type | Description
--- | --- | ---
Target | `React Element` | React Element to be used for passing the context and render the app on it.
context | `object` | Context to be passed to the Target component and to the `getInitialProps`
renderProps | `object` | Props used by React Router with some useful info. We're extracting the pageComponent from it

##### Response

The response is a promise resolved with two parameters. In addition, you can define an optional `__HTTP__` object in `initialProps` to allow server side redirects using SUI-SSR:

Field | Type | Description
--- | --- | ---
initialProps | `object` | Result of executing the `getInitialProps` of the pageComponent.
initialprops.__HTTP__ | `object` | An optional object containing a `redirectTo` key where an url might be included to allow 301 server side redirects using [sui-ssr](https://github.com/SUI-Components/sui/tree/master/packages/sui-ssr). 
reactString | `string` | String with the renderized app ready to be sent.

#### loadPage(contextFactory, importPage)

Load the page asynchronously by using React Router and resolving the getInitialProps. On the client it prepare the component to show the `renderLoading` (if specified) of the component.

##### Params

Field | Type | Description
--- | --- | ---
contextFactory | `function` | Context factory method to create the context that will be used on the app.
importPage | `function` | Import the chunk of the page

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

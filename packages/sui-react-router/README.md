# sui-react-router
> Set of navigational components that compose declaratively with your application.
 
## Definition

## Installation
```sh
npm install @s-ui/react-router
```

## Routes Setup

You must define a React Element with your application routes tree. Check the [Configuration Components](#configuration-components) documentation to see the available components and their configuration.

```js
// routes.js file
import { IndexRoute, Redirect, Route } from '@s-ui/react-router'

export default (
  <Route>
    <Redirect from="/" to="/es/" />
    <Route path="/:lang" component={App}>
      <IndexRoute getComponent={loadHomePage} />
      <Route
        path="products"
        getComponent={loadProductsPage}
      />
    </Route>
  </Route>
)
```

### Client Setup

In order to be able to use the `@s-ui/react-router` on the client you should wrap your application with the `<Router>` component. It will provide the needed context to be able to use components like `<Link>` inside your app.

```js
/* Basic example by using directly Router */
import {browserHistory, Router} from '@s-ui/react-router'
import routes from './routes'

// you're ready to render (or hydrate if you already has rendered your app in the server)
// you MUST wrap your app with the `<Router>` app that will provide the needed context
ReactDOM.hydrate(
  <Router history={browserHistory}>{routes}</Router>,
  document.getElementById('app')
)
```

```js
/* Advanced example using match method */
import {browserHistory, match, Router} from '@s-ui/react-router'
import routes from './routes'

match({routes, history: browserHistory}, (err, redirectLocation, renderProps) => {
  // if we have an error, log it and do nothing more
  if (err) {
    console.error(err)
    return
  }

  // if some <Redirect> has been matched, then we will have the `redirectLocation` info
  if (redirectLocation && redirectLocation.pathname) {
    window.location = redirectLocation.pathname
    return
  }

  // you're ready to render (or hydrate if you already has rendered your app in the server)
  // you MUST wrap your app with the `<Router>` app that will provide the needed context
  ReactDOM.hydrate(
    <Router>
      <App {...renderProps} />
    </Router>,
    document.getElementById('app')
  )
})
```

### Server Setup

## API Reference

- [Components](#components)
  - [`<Router>`](#router)
  - [`<Link>`](#link)
  - [`Context`](#routercontext)
    - [`context.router`](#contextrouter)

- [Configuration Components](#configuration-components)
  - [`<Route>`](#route)
  - [`<Redirect>`](#redirect)
  - [`<IndexRoute>`](#indexroute-1)

- [Route Components](#route-components)
  - [Injected Props](#injected-props)
  - [Named Components](#named-components)

- [Histories](#histories)
  - [`browserHistory`](#browserhistory)
  - [`createMemoryHistory()`](#creatememoryhistoryoptions)

- [Utilities](#utilities)
  - [`match()`](#match-routes-location-history-options--cb)


## Components

### `<Router>`
Primary component of `@s-ui/react-router`. It keeps your UI and the URL in sync and provides your application with the needed React context.

#### Props
##### `children` (required)
One or many [`<Route>`](#route)s, [`<Redirect>`](#redirect)s and one [`<IndexRoute>`](#indexroute-1). When the history changes, `<Router>` will match a branch of its routes, and render their configured [components](#routecomponent), with child route components nested inside the parents.

##### `routes`
Alias for `children`.

##### `history`
The history the router should listen to. Typically `browserHistory`. In server, for example, it would be `memoryHistory`.

```js
import { browserHistory } from 'react-router'
ReactDOM.render(<Router history={browserHistory} />, node)
```

### `<Link>`
The primary way to allow users to navigate around your application. `<Link>` will render a fully accessible anchor tag with the proper href.

A `<Link>` can know when the route it links to is active and automatically apply an `activeClassName` and/or `activeStyle` when given either prop. The `<Link>` will be active if the current route is either the linked route or any descendant of the linked route.

#### Props
##### `to`
A location destination. Usually this is a string or a function, with the following semantics:

* If it's a string it represents the absolute path to link to, e.g. `/users/123` (relative paths are not supported).
* If it's a function, it receives the `location` as a parameter and it must return the string following the rules of the previous point.
* If it is not specified, an anchor tag without an `href` attribute will be rendered.

_Note: @s-ui/react-router currently does not manage scroll position, and will not scroll to the element corresponding to `hash`._

```jsx
// String location descriptor.
<Link to="/hello">
  Hello
</Link>

// Function returning location descriptor.
<Link to={location => `/hello?name=${location.query.name}`}>
  Hello
</Link>

// This will still work and render and anchor <a> without href
<Link>
  Hello
</Link>
```

##### `activeClassName`
The className a `<Link>` receives when its route is active. No active class by default.

##### `activeStyle`
The styles to apply to the link element when its route is active.

##### `onClick(e)`
A custom handler for the click event. Works just like a handler on an `<a>` tag - calling `e.preventDefault()` will prevent the transition from firing, while `e.stopPropagation()` will prevent the event from bubbling.

##### `onlyActiveOnIndex`
If `true`, the `<Link>` will only be active when the current route exactly matches the linked route.

##### `innerRef`
Allows access to the underlying `ref` of the component.

##### *others*
You can also pass props you'd like to be on the `<a>` such as a `title`, `id`, `className`, etc.

#### Example
Given a route like `<Route path="/users/:userId" />`:

```js
<Link to={`/users/${user.id}`} activeClassName="active">{user.name}</Link>
// becomes one of these depending on your History and if the route is
// active
<a href="/users/123" class="active">Michael</a>
<a href="#/users/123">Michael</a>

// change the activeClassName
<Link to={`/users/${user.id}`} activeClassName="current">{user.name}</Link>

// change style when link is active
<Link to="/users" style={{color: 'white'}} activeStyle={{color: 'red'}}>Users</Link>

const refCallback = node => {
  // `node` refers to the mounted DOM element or null when unmounted
}
<Link to="/" innerRef={refCallback} />
```

### Router Context
A `<RouterContext>` renders the component tree for a given router state. It's used by `<Router>` but also useful for server rendering and integrating in brownfield development.

It also provides a `router` object on [context](https://facebook.github.io/react/docs/context.html).

#### `context.router`

Contains data and methods relevant to routing. Most useful for imperatively transitioning around the application.

##### `push(pathOrLoc)`
Transitions to a new URL, adding a new entry in the browser history.

```js
router.push('/users/12')

// or with a location descriptor object
router.push({
  pathname: '/users/12',
  query: { modal: true },
  state: { fromDashboard: true }
})
```

##### `replace(pathOrLoc)`
Identical to `push` except replaces the current history entry with a new one.

##### `go(n)`
Go forward or backward in the history by `n` or `-n`.

##### `goBack()`
Go back one entry in the history.

##### `goForward()`
Go forward one entry in the history.

##### `createPath(pathOrLoc, query)`
Stringifies the query into the pathname, using the router's config.

##### `createHref(pathOrLoc, query)`
Creates a URL, using the router's config. For example, it will add `#/` in front of the `pathname` for hash history.

##### `isActive(pathOrLoc, indexOnly)`
Returns `true` or `false` depending on if the `pathOrLoc` is active. Will be true for every route in the route branch matched (child route is active, therefore parent is too), unless `indexOnly` is specified, in which case it will only match the exact path.

A route is only considered active if all the URL parameters match, including optional parameters and their presence or absence.

However, only explicitly specified query parameters will be checked. That means that `isActive({ pathname: '/foo', query: { a: 'b' } })` will return `true` when the location is `/foo?a=b&c=d`. To require that a query parameter be absent, specify its value as an explicit `undefined`, e.g. `isActive({ pathname: '/foo', query: { a: 'b', c: undefined } })`, which would be `false` in this example.


## Configuration Components

### `<Route>`
A `<Route>` is used to declaratively map routes to your application's component hierarchy.

#### Props
##### `path`
The path used in the URL.

It will concat with the parent route's path unless it starts with `/`,
making it an absolute path.

If left undefined, the router will try to match the child routes.

##### `component`
A single component to be rendered when the route matches the URL. It can
be rendered by the parent route component with `props.children`.

```js
const routes = (
  <Route path="/" component={App}>
    <Route path="groups" component={Groups} />
    <Route path="users" component={Users} />
  </Route>
)

function App ({ children }) {
  return (
    <section>
      {/* children will be either <Users> or <Groups> depending on path */}
      {children}
    </section>
  )
}
```

##### `getComponent(nextState, callback)`
Same as `component` but asynchronous, useful for code-splitting. 

You can pass a Promise, in which case you should not use the `callback` function and instead use `resolve` like you normally would. You can also pass an async function, which is a Promise under the hood, and just `return` like normal. Any thrown exception will report an error to the router.

###### `callback` signature
`cb(err, component)`

```js
<Route path="courses/:courseId" getComponent={(nextState, cb) => {
  // do asynchronous stuff to find the components
  cb(null, Course)
}} />
```


### `<Redirect>`
A `<Redirect>` sets up a redirect to another route in your application to maintain old URLs.

#### Props
##### `from`
The path you want to redirect from, including dynamic segments.

##### `to`
The path you want to redirect to.

##### `query`
By default, the query parameters will just pass through but you can specify them if you need to.

```js
// Say we want to change from `/profile/123` to `/about/123`
// and redirect `/get-in-touch` to `/contact`
<Route component={App}>
  <Route path="about/:userId" component={UserProfile} />
  {/* /profile/123 -> /about/123 */}
  <Redirect from="profile/:userId" to="about/:userId" />
</Route>
```

Note that the `<Redirect>` can be placed anywhere in the route hierarchy, though [normal precedence](/docs/guides/RouteMatching.md#precedence) rules apply. If you'd prefer the redirects to be next to their respective routes, the `from` path will match the same as a regular route `path`.

```js
<Route path="course/:courseId">
  <Route path="dashboard" />
  {/* /course/123/home -> /course/123/dashboard */}
  <Redirect from="home" to="dashboard" />
</Route>
```

### `<IndexRoute>`
An `<IndexRoute>` allows you to provide a default "child" to a parent route when visitor is at the URL of the parent.

Please see the [Index Routes guide](/docs/guides/IndexRoutes.md).

#### Props
All the same props as [Route](#route) except for `path`.


## Route Components
A route's component is rendered when that route matches the URL. The router will inject the following properties into your component when it's rendered:

### Injected Props

#### `location`
The current [location](https://github.com/ReactTraining/history/blob/v2/docs/Location.md).

#### `params`
The dynamic segments of the URL.

#### `route`
The route that rendered this component.

#### `router`
Contains methods relevant to routing. Most useful for imperatively transitioning around the application.

#### `routes`
The routes registered with the router.

#### `routeParams`
A subset of `props.params` that were directly specified in this component's route. For example, if the route's path is `users/:userId` and the URL is `/users/123/portfolios/345` then `props.routeParams` will be `{userId: '123'}`, and `props.params` will be `{userId: '123', portfolioId: '345'}`.

#### `children`
The matched child route element to be rendered.

##### Example
```js
render((
  <Router>
    <Route path="/" component={App}>
      <Route path="groups" component={Groups} />
      <Route path="users" component={Users} />
    </Route>
  </Router>
), node)

function App (props) {
  return (
    <div>
      {/* this will be either <Users> or <Groups> */}
      {props.children}
    </div>
  )
}
```

## Histories

### `browserHistory`
`browserHistory` uses the HTML5 History API when available, and falls back to full refreshes otherwise. `browserHistory` requires additional configuration on the server side to serve up URLs, but is the generally preferred solution for modern web pages.

### `createMemoryHistory([options])`
`createMemoryHistory` creates an in-memory `history` object that does not interact with the browser URL. This is useful for when you need to customize the `history` object used for server-side rendering, for automated testing, or for when you do not want to manipulate the browser URL, such as when your application is embedded in an `<iframe>`.


## Utilities

### `match({ routes, location, [history], [...options] }, cb)`

This function is to be used for server-side rendering. It matches a set of routes to a location, without rendering, and calls a `callback(error, redirectLocation, renderProps)` when it's done.

The function will create a `history` for you, passing the additional `options` along to create it. These options can include `basename` to control the base name for URLs, as well as the pair of `parseQueryString` and `stringifyQuery` to control query string parsing and serializing. You can also pass in an already instantiated `history` object, which can be constructed however you like.

The three arguments to the callback function you pass to `match` are:
- `error`: A Javascript `Error` object if an error occurred, `undefined` otherwise.
- `redirectLocation`: A [Location](/docs/Glossary.md#location) object if the route is a redirect, `undefined` otherwise.
- `renderProps`: The props you should pass to the routing context if the route matched, `undefined` otherwise.

If all three parameters are `undefined`, this means that there was no route found matching the given location.

*Note: You probably don't want to use this in a browser unless you're doing server-side rendering of async routes.*

## Next features
- Upgrade to History v6
- Add hooks support
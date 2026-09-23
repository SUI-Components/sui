# sui-critical-css

> Extract Critical CSS from a set of URLs for an app

## How it works

1. Read the config options and routes provided.
2. For each route, it opens a browser, navigate and extract the Critical CSS.
3. Create a css file in the `critical-css` folder.
4. After doing this for each route, then creates a `critical.json` file that could be read for every path to extract the critical-css.
5. Use then `@s-ui/critical-css-middleware` to extract to use in your Express app the CSS.

## How to use to extract

Install package to your project:

```
npm install @s-ui/critical-css -D
```

## Programmatic usage:

In order to extract critical css and match extracted files with your page or route you can use two approaches:

- Using path-to-regex
- Using page component displayName

You can combine both of them.

Additionally there are two optional parameters:

- `requiredClassNames`: A list of required css class names. If they aren't present in the generated Critical CSS, the extraction is retried, and an empty Critical CSS is written once the attempts run out.
- `retries`: How many times a route is extracted while its `requiredClassNames` aren't present. By default it's 3.

Both can be set on `config`, where they apply to every route, and on a single route, where they
override the config. Setting them on `config` is the only way to validate a route declared as a
plain string, since such a route cannot carry options of its own:

```js
const config = {
  hostname: 'http://localhost',
  requiredClassNames: ['.sui-AtomButton'], // checked on every route below
  retries: 2
}

const routes = {
  '/:lang': '/es',
  '/:lang/catalogo-productos': {
    url: '/es/catalogo-productos',
    requiredClassNames: ['.ma-AdCardV2'] // only this list is checked here
  }
}
```

### Using `path-to-regex`:

You can use [Express Route Tester](http://forbeslindesay.github.io/express-route-tester/) to create and validate that your Path-to-Regexp works as expected.

Example:

```js
// scripts/get-critical-css-for-routes.js
import {extractCSSFromApp} from '@s-ui/critical-css'

const config = {
  hostname: 'http://localhost'
}

const routes = {
  '/:lang': {
    url: '/es'
  },
  '/:lang/catalogo-productos': {
    url: ['/es/catalogo-productos', '/en/catalogo-productos']
  }
}

extractCSSFromApp({config, routes})
```

### Using `displayName`

Example:

```js
// scripts/get-critical-css-for-routes.js
import {extractCSSFromApp} from '@s-ui/critical-css'

// Page display names
const displayNames = {
  home: 'Home',
  list: 'List'
}

const config = {
  hostname: 'http://localhost'
}

const routes = {
  [displayNames.home]: {
    url: '/es'
  },
  [displayNames.list]: {
    url: '/es/catalogo-productos',
    requiredClassNames: ['.ma-AdCardV2'],
    retries: 3
  }
}

extractCSSFromApp({config, routes})
```

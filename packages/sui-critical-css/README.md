# sui-critical-css
> Extract Critical CSS from a set of URLs for an app

## How it works

1. Read the config options and routes provided.
2. For each route, it opens a browser, navigate and extract the Critical CSS.
3. Create a css file in the `critical-css` folder.
4. After doing this for each route, then creates a `critical.json` file that could be read for every path to extract the critical-css.

## How to use to extract 

Install package to your project:
```
npm install @s-ui/critical-css -D
```

## Programatical usage:

In order to extract critical css and match extracted files with your page or route you can use two approaches:

- Using path-to-regex
- Using page component displayName

You can combine both of them.

Additionally there are two optional config parameters:

- `requiredClassNames`: A list of required css class names. If they aren't present in the generated Critical CSS, it would be discarded. By default there would be 2 retries to try to get the correct Critical CSS
- `retries`: Number of retries if the requiredClassNames aren't present in the Cfritical CSS. By default it's 2.

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
    url: '/es/catalogo-productos'
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

## Use in your server

You should execute this script on your CI before deploying/dockerizing your app.

```
node scripts/get-critical-css-for-routes.js
```
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

Programmatic usage:

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

Now you should execute this script on your CI before deploying/dockerizing your app.

```
node scripts/get-critical-css-for-routes.js
```
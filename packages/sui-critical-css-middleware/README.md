# sui-critical-css-middleware
> Express middleware to handle all regarding Critical CSS usage

**This middleware works along with @s-ui/critical-css package**

## Install

Install package to your project:
```
npm install @s-ui/critical-css-middleware -E
```

## How to use

You should provide the `deviceType` and the `manifest` from Webpack in order to find the criticalCSS created with `@s-ui/critical-css` package.

If found, it will put in `req.criticalCSS` the needed CSS for the page.

```js
/* eslint-disable no-console */
const getCriticalCssMiddleware = require('@s-ui/critical-css/src/middleware.cjs')
const parser = require('ua-parser-js')
const fs = require('fs')
const path = require('path')

let manifest = {}
try {
  manifest = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'critical-css', 'critical.json'),
      'utf8'
    )
  )
  console.log('manifest for Critical CSS:')
  console.log(manifest)
} catch (error) {
  console.warn('manifest for Critical CSS is missing')
}

module.exports = (req, res, next) => {
  // calculate device type with userAgent
  const ua = parser(req.headers['user-agent'])
  const {type} = ua.device

  return getCriticalCssMiddleware({
    deviceType: type,
    manifest
  })(req, res, next)
}
```
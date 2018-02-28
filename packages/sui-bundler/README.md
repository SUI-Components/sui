# sui-bunder
> Config-free bundler for ES6 React apps.

Features:
* Simple CLI for prod and dev environment
* Unique solution for bundling; no boilerplate, no config.
* Remote improvements inherited transparently (ej: monitoring, PWA, etc)

## Installation

```sh
$ npm install @s-ui/bundler --save-dev
```

## Usage

Add bundling scripts to your **package.json**

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "scripts": {
    "build": "sui-bundler build -C",
    "start": "sui-bundler dev"
  }
}
```

## Requirements

node 6+ version is required.

### Folder structure

Refer to [example folder](./example) to see what's expected, which is basically:

```
├── package.json
└── src
    ├── index.html
    └── app.js
```

With `index.html` as app home and`app.js` as entry point.

## CLI

### Development

```
$ sui-bundler dev
```

While developing your app, you will have HMR (Hot Module Reloading). Default port for your website is 3000, but it will assign automatically a free port for you if this one is busy.

### Production

```
$ sui-bundler build
```

It will build a deployable folder `public` where you can find all your statics. If you wish to remove the content of the folder before generating new files, just use the flag `--clean | -C`

## Configuration

This tool works with zero configuration out the box but you could use some configuration in order to optimize or adapt the output to your needs. For that, you need to add a property `sui-bundler` inside the package.json of your project.

`scripts` property accept ScriptExtHtmlWebpackPlugin config: https://github.com/numical/script-ext-html-webpack-plugin#configuration

```json
{
  "sui-bundler": {
    "env": ["APP_NAME", ["USER", "DEFAULT_VALUE"]],
    "vendor": ["react", "react-dom"],
    "cdn": "https://url_to_me_cdn.com/",
    "alias": {"react": "preact"},
    "offline": true,
    "externals": {
      "jquery": "./node_modules/jquery/jquery.min.js"
    },
    "scripts": {
       "prefetch": "low-priority-chunk.js",
       "preload": [ "page1.js", "page2.js" ]
     }
  }
}
```

> The URL to the CDN **MUST** end with a slash `/`

## Offline

Offline feature is deactivated by default. If you want to activate, you should put `offline: true` in the sui-bundler configuration in your package.json. Also, you need to configure a serviceWorker in the entry point of your app:

```js
import {register, unregister} from '@s-ui/bundler/registerServiceWorker'
register({
  first: () => window.alert('Content is cached for offline use.'),
  renovate: () => window.alert('New content is available; please refresh.')
})()
```

You should pass a handler in order to handle when it gets cached for the first time the content and another when you get new content and want to handle how to show a notification to the user in order to let him decide if he wants to refresh the page.

If you're using Firebase, it's recommendable to not cache the file serviceWorker.js, adding this config to your `firebase.json`

```json
{
  "hosting": {
    "headers": [{
      "source" : "/service-worker.js",
      "headers" : [ {
        "key" : "Cache-Control",
        "value" : "no-cache"
      }]
    }]
  }
}
```

If you want to remove your ServiceWorker, you need to use the method `unregister`, the same way you used the `register` method before.

### Caching

You could use it to be used offline:

```js
"offline": {
  whitelist: ["::all::"]
  "runtime": [{
    "urlPattern": "ms-mt--api-web\\.spain\\.schibsted\\.io",
    "handler": "networkFirst"
  },{
    "urlPattern": "fonts\\.googleapis\\.com",
    "handler": "fastest"
  },{
    "urlPattern": "prea\\.ccdn\\.es\/cnet\/contents\/media",
    "handler": "cacheFirst",
    "options": {
      "cache": {
        "name": "image-cache",
        "maxEntries": 50
      }
  }}]
}
```

Runtime follows the (API of sw-toolbox)[https://googlechrome.github.io/sw-toolbox/]. Also, the whitelist is a list of regexp that indicates which pages are secure to use only Client Server Rendering. You could use the `::all::` string for indicating that you always want to use Client Side Rendering.

## Externals

It offers you a way to upload an external library to your project that you normally will put by hand in a tag script in the index.html file. It adds a reference in the index.html with a hash.

## Hot Module Replacement - React
It offers Hot Module Replacement out-of-the-box, you only has to follow these instructions for your project: https://webpack.js.org/guides/hmr-react/#code

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

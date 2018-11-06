# sui-bunder

> Config-free bundler for ES6 React apps.

Features:

- Simple CLI for prod and dev environment
- Unique solution for bundling; no boilerplate, no config.
- Remote improvements inherited transparently (ej: monitoring, PWA, etc)

## Installation

```sh
$ npm install @s-ui/bundler --save-dev
```

## Usage for web app bundling

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

## Requirements for web app bundling

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

#### How to link packages

`sui-bundler` give us the oportunity to link `npm` packages with `--link-package`. This argument accepts relative and absolute paths.
`sui-bundler` internally will change the path of the files to use. So it goes directly to our local files.
The reason we use `link-package` instead of `npm link` is because it gives a plus of performance when we are linking packages.
The **link is cancelled as soon as we stop/cancel the terminal process**.

**Requirements**

- Only available in DEV mode.
- A `src/index.js` have to exist in the path provided

**Example:**

```
$ sui-bundler dev --link-package=/absolute_path/to/npm_package
$ sui-bundler dev --link-package=../relative_path/to/npm_package
```

To link more than one package at time, use as many times as desired the argument.

```
$ sui-bundler dev --link-package=/absolute_path/to/npm_package --link-package=/absolute_path2/to/npm_package
```

### Production

```
$ sui-bundler build
```

It will build a deployable folder `public` where you can find all your statics. If you wish to remove the content of the folder before generating new files, just use the flag `--clean | -C`

### Library

You can use sui-bundler to bundle a package as a library that can be injected with a simple script tag.

```
$ sui-bundler lib
```

You should create an entry file that assigns your lib to your desired namespace:

```js
// umd.js
import MyFancyModule from '/src/index.js'
window.namespace.fancy = MyFancyModule
```

You should create an entry file that assigns your lib to your desired namespace:

And then execute `sui-bundler lib` with your destination config:

```
sui-bundler lib umd/index.js -o lib/fancy -p http://my-cdn.com/fancy
```

`sui-bundler lib` will add your package version as subfolder:
- `-o lib/fancy` outputs to `./lib/fancy/0.0.0/`
- `-p http://my-cdn.com/fancy` sets `http://my-cdn.com/fancy/0.0.0` as public path for chunks loading.
- `-r http://my-cdn.com/fancy` sets `http://my-cdn.com/fancy` as public path for chunks loading, discarded the version subdirectory.

#### Automatic UMD

You can use `--umd` option to publish directly from your original entry file:

```
$ sui-bundler lib src/index.js -o umd/fancy -p http://my-cdn.com/fancy --umd="MyFancyLibraryNamespace"
```

Then you can find your library directly in the provided namespace variable: `window.MyFancyLibraryNamespace` or `window.MyFancyLibraryNamespace.default` for ES6 exports.

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
      "preload": ["page1.js", "page2.js"]
    }
  }
}
```

**advice:** the alias option will not work for dev environment
> The URL to the CDN **MUST** end with a slash `/`

## Offline

Offline feature is deactivated by default. If you want to activate, you should put `offline: true` in the sui-bundler configuration in your package.json. Also, you need to configure a serviceWorker in the entry point of your app:

```js
import {register, unregister} from '@s-ui/bundler/registerServiceWorker'
register({
  first: () => window.alert('Content is cached for offline use.'),
  renovate: () => window.alert('New content is available; please refresh.')
})();
```

You should pass a handler in order to handle when content gets cached for the first time the content and another when you get new content and want to handle how to show a notification to the user in order to let him decide if he wants to refresh the page.

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

Runtime follows the (API of sw-toolbox)[https://github.com/GoogleChromeLabs/sw-toolbox]. Also, the whitelist is a list of regexp that indicates which pages are secure to use only Client Server Rendering. You could use the `::all::` string to indicate that you always want to use Client Side Rendering.

## Externals

It offers you a way to upload an external library to your project that you would normally put by hand in a tag script in the index.html file. It adds a reference in the index.html with a hash.

## Hot Module Replacement - React

It offers Hot Module Replacement out-of-the-box, you only have to follow [these instructions](https://webpack.js.org/guides/hot-module-replacement/#enabling-hmr) for your project.

## Ignoring pre enforced loaders

Use in case of generated code, for example

```sh
> sui-bundler dev --no-pre-loader
```

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

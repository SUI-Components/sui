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

If you want to link all the packages inside a monorepo-multipackage. Use the flag `--link-all` pointing to the folder where each package lives.
For example, if you want to link all the components in a Studio, the command should be:

```
$ sui-bundler dev --link-all ../frontend-ma--uilib-components/components
```

And of course you can combine `link-all` and `link-package` flags

### Production

```
$ sui-bundler build
```

It will build a deployable folder `public` where you can find all your statics. If you wish to remove the content of the folder before generating new files, just use the flag `--clean | -C`
If you want you can use the flag `--link-package` with this commands

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

`manualCompression`: Compress files manually to gzip and brotli (if supported). Useful to use along with a S3 and Lambda@Edge in order to send the best content for the userAgent. (default: `false`)

`targets`: Object with information about the browser and version supported. (default: `see the next example`)

```json
{
  "sui-bundler": {
    "onlyHash": "true",
    "env": ["APP_NAME", ["USER", "DEFAULT_VALUE"]],
    "vendor": ["react", "react-dom"],
    "cdn": "https://url_to_me_cdn.com/",
    "externals-manifest": "https://url_to_me_cdn/manifest.json",
    "alias": {"react": "preact"},
    "offline": true,
    "manualCompression": true,
    "targets": {
      "chrome": "41",
      "ie": "11",
      "safari": "8",
      "firefox": "60",
      "ios": "8"
    },
    "externals": {
      "jquery": "./node_modules/jquery/jquery.min.js"
    },
    "scripts": {
      "prefetch": "low-priority-chunk.js",
      "preload": ["page1.js", "page2.js"]
    },
    "sourcemaps": {
      "dev": "cheap-module-eval-source-map",
      "prod": "hidden-source-map"
    }
  }
}
```

> The URL to the CDN **MUST** end with a slash `/`

## OnlyHash

In windows system filenames with `~` could produce errors. To avoid that you can use the flag `onlyHash` in your configuration to go form names like `Home.123.js` to `123.js`. And that should solve the issue.

## Offline

Offline feature is deactivated by default. If you want to activate, you need to create the static `src/offline.html` file. No resource loaded by this page will be cached so watch out adding images or external scripts as they won't work in offline mode. You also need to configure a serviceWorker in the entry point of your app:

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

Setting up the `src/offline.html` static page will also activate the statics cache. All static named in the `asset-manifest.json` file will be cached except webpack's `runtime` chunks.

## Externals Manifest
If your are using an external CDN to store statics assets that are now managed by Webpack, like SVG or IMGs, you can create a manifest.json file in the root of your CDN (likehttps://spa-mock-statics.surge.sh/manifest.json`).

If you define the `externals-manifest` key in the config pointing to this link, sui-bundler will replace any ocurrence of each key for the value

If in your CSS you have:

```
#app {
  color: blue;
  background: url('https://spa-mock-statics.surge.sh/images/common/sprite-sheet/sprite-ma.png') no-repeat scroll;
}
```

After compile you will get:

```
#app{color:#00f;background:url(https://spa-mock-statics.surge.sh/images/common/sprite-sheet/sprite-ma.72d1edb214.png) no-repeat scroll}
```

Or if in your JS you have:

```
<img
  src={'https://spa-mock-statics.surge.sh/images/common/mis-anuncios2.gif'}
/>
```

After compile will be:

```
<img src="https://spa-mock-statics.surge.sh/images/common/mis-anuncios2.5daef216ab.gif">
```

The main idea is have a long term caching strategy for the hashed files. But you **NEVER** must cache the `manifest.json` file.

Create the manifest file is up to you, but your file must follow this schema.
```
{
  /images/favicon.ico: "/images/favicon.23f4ccc7ca.ico",
  /images/common/arrow-down.png: "/images/common/arrow-down.2d12edfb00.png",
  /images/common/icons-spritesheet.png: "/images/common/icons-spritesheet.9498fa3745.png",
}
```

> If you setup the `NODE_ENV=development` then this loaders will be disabled.
## Externals

It offers you a way to upload an external library to your project that you would normally put by hand in a tag script in the index.html file. It adds a reference in the index.html with a hash.

## Hot Module Replacement - React

It offers Hot Module Replacement out-of-the-box, you only have to follow [these instructions](https://webpack.js.org/guides/hot-module-replacement/#enabling-hmr) for your project.

## Ignoring pre enforced loaders

Use in case of generated code, for example

```sh
> sui-bundler dev --no-pre-loader
```

## Configuring source map generation

SUI-bundler generates no sourcemaps by default but you can change this behaviour and configure them in the sui-bundler section of your package.json.
Different values can be configured for development (`dev`) and production (`prod`) webpack configs.

```json
{
  "sui-bundler": {
    "sourcemaps": {
      "dev": "cheap-module-eval-source-map",
      "prod": "hidden-source-map"
    }
  }
}
```


Check all possible values accepted by webpack in the [devtool webpack docs](https://webpack.js.org/configuration/devtool/#devtool)

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

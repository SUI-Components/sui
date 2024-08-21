# sui-bundler

> Config-free bundler for ES6 React apps.

Features:

- Simple CLI for prod and dev environment
- Unique solution for bundling; no boilerplate, no config.
- Remote improvements inherited transparently (ej: monitoring, PWA, etc)

## Installation

```sh
npm install @s-ui/bundler --save-dev --legacy-peer-deps
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

node 12 version is required.

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

You can also use `-l` as a shorthand to link a package.

```
$ sui-bundler dev -l /absolute_path/to/npm_package -l /absolute_path2/to/npm_package
```

If you want to link all the packages inside a monorepo-multipackage. Use the flag `--link-all` pointing to the folder where each package lives.
For example, if you want to link all the components in a Studio, the command should be:

```
$ sui-bundler dev --link-all ../frontend-ma--uilib-components/components
```

You can use `-L` as a shorthand to link all packages.

```
$ sui-bundler dev -L ../frontend-ma--uilib-components/components
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

This tool works with zero configuration out the box but you could use some configuration in order to optimize or adapt the output to your needs. For that, you need to add a property `sui-bundler` inside a `config` property in the package.json of your project.

`extractComments`: Determine whether comments shall be extracted to a separate file or not. Like LICENSE comments. (default: `false`)

`targets`: Object with information about the browser and version supported. (default: `see the next example`)

```json
{
  "config": {
    "sui-bundler": {
      "supportLegacyBrowsers": true, // default
      "onlyHash": "true",
      "env": ["APP_NAME", ["USER", "DEFAULT_VALUE"]],
      "vendor": ["react", "react-dom"],
      "cdn": "https://url_to_me_cdn.com/",
      "externals-manifest": "https://url_to_me_cdn/manifest.json",
      "alias": {
        "react": "preact"
      },
      "offline": true,
      "sourcemaps": {
        "dev": "cheap-module-eval-source-map",
        "prod": "hidden-source-map"
      }
    }
  }
}
```

> The URL to the CDN **MUST** end with a slash `/`

## OnlyHash

In windows system filenames with `~` could produce errors. To avoid that you can use the flag `onlyHash` in your configuration to go form names like `Home.123.js` to `123.js`. And that should solve the issue.

## Offline and SW support

Offline feature is deactivated by default. If you want to activate, you need to create the static `src/offline.html` file. No resource loaded by this page will be cached so watch out adding images or external scripts as they won't work in offline mode. You also need to configure a serviceWorker in the entry point of your app:

If you have the page "src/offline.html" in your project, but you have configured the option "fallback" in your package.json. The generated SW will manage the fallback and ignore your offline page.

```js
import {register, unregister} from '@s-ui/bundler/registerServiceWorker'
register({
  first: () => window.alert('Content is cached for offline use.'),
  renovate: () => window.alert('New content is available; please refresh.')
})
```

You should pass a handler in order to handle when content gets cached for the first time the content and another when you get new content and want to handle how to show a notification to the user in order to let him decide if he wants to refresh the page.

If you want to remove your ServiceWorker, you need to use the method `unregister`, the same way you used the `register` method before.

### Only Caching

It's possible to create a service worker that caches all static resources

There are two ways to activate the statics cache option:

1. Create a `src/offline.html` page as mentioned in the [offline](#Offline) section
2. Add the `staticsCacheOnly` option within the package.json like this:

```json
{
  "sui-bundler": {
    "offline": {
      "staticsCacheOnly": true
    }
  }
}
```

> Statics will be cached but no offline page will be activated

## Externals Manifest

If your are using an external CDN to store statics assets that are now managed by Webpack, like SVG or IMGs, you can create a manifest.json file in the root of your CDN (likehttps://spa-mock-statics.surge.sh/manifest.json`).

If you define the `externals-manifest` key in the config pointing to this link, sui-bundler will replace any ocurrence of each key for the value

If in your CSS you have:

```css
#app {
  color: blue;
  background: url('https://spa-mock-statics.surge.sh/images/common/sprite-sheet/sprite-ma.png')
    no-repeat scroll;
}
```

After compile you will get:

```css
#app {
  color: #00f;
  background: url(https://spa-mock-statics.surge.sh/images/common/sprite-sheet/sprite-ma.72d1edb214.png)
    no-repeat scroll;
}
```

Or if in your JS you have:

```jsx
<img
  src={'https://spa-mock-statics.surge.sh/images/common/mis-anuncios2.gif'}
/>
```

After compile will be:

```jsx
<img src="https://spa-mock-statics.surge.sh/images/common/mis-anuncios2.5daef216ab.gif">
```

The main idea is have a long term caching strategy for the hashed files. But you **NEVER** must cache the `manifest.json` file.

Create the manifest file is up to you, but your file must follow this schema.

```json
{
  /images/favicon.ico: "/images/favicon.23f4ccc7ca.ico",
  /images/common/arrow-down.png: "/images/common/arrow-down.2d12edfb00.png",
  /images/common/icons-spritesheet.png: "/images/common/icons-spritesheet.9498fa3745.png",
}
```

> If you setup the `NODE_ENV=development` then this loaders will be disabled.

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

## Migrations

### Migrate from v7 to v8

`useExperimentalSCSSLoader` is not used anymore and it will be ignored.

### Migrate from v6 to v7

- In order to keep same config object across all `sui` tools, `sui-bundler` config has been moved from package.json root to the `config` property.

```json
// before
{
  "sui-bundler": { /* config */ }
}

//now
{
  "config": {
    "sui-bundler": { /* config */ }
  }
}
```

- As major `html-webpack-plugin` is being used, if you're using templates on your `index.html` to access chunks, you must change it to use `js` property instead `chunks`.

```js
// before
const {app, vendor} = htmlWebpackPlugin.files.chunks
// now
const {app, vendor} = htmlWebpackPlugin.files.js
```

- `manualCompression` flag on your `sui-bundler` config is not longer supported and it will be ignored. No more manual compression are featured.

- `scripts` config is not longer supported as `ScriptExtHtmlWebpackPlugin` is not longer used.

- Deprecated usage of old service-worker based on `workbox` has been removed.

- Now, only `.js` and `.json` extensions will be resolved if you ignore them on importing the file.

```js
// before
import util from './util' // finally, any extension will be handled as we're using * as a fallback
// after
import util from './util' // only .js and .json files will be resolved
```

- `externals` config has been removed. Stop using `externals` for loading external scripts and just put your scripts in the `src/index.html` file or load by importing them in your app.

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

# sui-widget-embedder

> Widget development server and build for production

## Motivation

(1) Improve the DX for several widgets that work together; (2) Create an easy-to-use page application.

## Installation

```sh
npm install @s-ui/widget-embedder --save
```

## Usage

### File structure

Your project must follow the following folder structure:

```
.
├── package.json <- Project package.json
└── pages
    ├── detail <- Name of the page where widgets will be
    │   ├── Gallery.js <- Widget
    │   ├── ContactForm.js <- Widget
    │   ├── index.js <- Bootstrap widgets
    │   ├── index.scss
    │   └── package.json <- Page package.json
    └── list
        ├── index.js
        ├── Footer.scss
        ├── index.scss
        └── package.json <- Page package.json
```

### Generating pages where widgets will live

If you don't want to take care about base code and folder creation of a new page for widgets you can use the `generate` functionality of the `sui-widget-embedder`:

```
$ sui-widget-embedder generate <pageName>
```

This will create the base files to make your first widget work.

You can also define the regExp that should match to load your widget into the page doing the follow:

```
$ sui-widget-embedder generate <pageName> -E 'expression'
```

Note that the quotes here are not 'optional' you can add an expresion without quotes off course but you'll need to escape all the chars that are interpretable by the terminal.

## Configs

### Project config

```
"config": {
  "sui-widget-embedder": {
    "remoteCdn": "http://cdn-widgets-vibbo-pro.surge.sh",
    "devPort": "2017"
  }
}
```

Inside your project-level package.json, you could config the library,

- `alias` [OPTIONAL]: create aliases to `import` certain modules more easily or to avoid importing them in production.
- `remoteCdn` [OPTIONAL] (default: `'/'`): the base path of the cdn where your assets will be located.
- `devPort` [OPTIONAL] (default: `3000`): Port where your development server will be listening.

### Page config

Inside each page you must create a package.json file.

```json
{
  "pathnameRegExp": ["/d\\w+\\.html"],
  "hrefRegExp":["/d\\w+\\.html"],
  "blacklistedRegExps": [
    "about.html",
    "contact.html"
  ],
  "vendor": [
    "react",
    "react-dom"
  ]
}
```

- `pathnameRegExp` [*REQUIRED]: RegExp or array of RegExp as strings to identify the pathname of the page where this list of widgets must work. In case of array of RegExp, the widget will load if at least one RegExp matches with the current location.
- `hrefRegExp` [*REQUIRED]: RegExp or array of RegExp as strings to identify the href of the page where this list of widgets must work. In case of array of RegExp, the widget will load if at least one RegExp matches with the current location.
- `blacklistedRegExps` [OPTIONAL]: List of RegExps to identify the pathname of the pages where the widgets don't have to work at.
- `vendor` [OPTIONAL]: In case you want to have a vendor file for this page only.
(*) It's required just one of these two fields: pathnameRegExp or hrefRegExp

## Working with React

sui-widget-embedder does not expect to work with React. But if you want to create your widgets as React trees in your page, there are 3 helper utilities:

```js
import Widget from '@s-ui/widget-embedder/react/Widget'
import Widgets from '@s-ui/widget-embedder/react/Widgets'
import render from '@s-ui/widget-embedder/react/render'
```

- `render`: A method that expects a tree of React components starting with a Widgets root.

- `Widgets`: React Component that encapsules all your widgets.

- `Widget`: React Component that renders the children as a new React tree in another place of the page. Available props:
  * `children` *(required)*: Content of the Widget. Should be a compatible React Element.
  * `context`: Object with the context object that you want to be available inside the widget.
  * `isVisible` *(default: true)*: Determine if the widget must be shown.
  * `renderMultiple` *(default: false)*: Determine if the Widget must be rendered on every node found using the selector prop. If `false` the Widget will be rendered only in the first node found.
  * `selector`: *(required)* CSS Path to select the node (or nodes) where you want to render the Widget.

### Passing a context to a Widget

Sometimes the components you want to render inside a Widget are expecting a React Context to be available. You could use the prop `context` in order to send an object that will be used to create an static context by using *@s-ui/react-context*.

```js
import Widget from '@s-ui/widget-embedder/react/Widget'
import Widgets from '@s-ui/widget-embedder/react/Widgets'
import render from '@s-ui/widget-embedder/react/render'
import ComponentToRender from 'awesome-component'

import './index.scss'

const context = {
  cookies: document.cookie,
  userAgent: navigator.userAgent
}

render(
  <Widgets>
    <Widget node="#widget-to-render" context={context}>
      <ComponentToRender />
    </Widget>
  </Widgets>,
  'widget-to-render'
)
```

## How to develop

For start developing your widget, you should use the `sui-widget-embeeder` like this:

```
$ sui-widget-embedder dev -p <pageName>
```

This will create a bundle with all the widgets for the page that you could add in your sites in order to test it.

Also, it will copy to your clipboard a Javascript code snippet. Open the page in which you want to run your widgets, open the Developer Tools and run the Javascript snippet in the console to load the widget.

💡 You could create a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) with the snippet. For that, just add `javascript:` before the snippet provided in order to improve your DX. Be aware as the PORT provided could change.

## How to build

If you want to get the remoteCdn from package config you just need to do that:

```
$ sui-widget-embedder build
```

If you want to define the remoteCdn by command option you can pass it using the param -R or --remoteCdn

```
$ sui-widget-embedder build -R http://mycdn.com
```

## Propagate webpack's resolve.alias config

In case you need this feature of webpack (e.g to not load faker in prod environment) you have to add an `alias` to your `sui-widget-embedder's` option within your package.json like so:

```
  "sui-widget-embedder": {
    ...
    "alias": {
      "moduleToLoad": "path/to/file/to/load"
    }
  }
```

## Migrations

### Migrate from v3 to v4

- This version uses latest **@s-ui/bundler@7**. You might want to check [its migration guide.](https://github.com/SUI-Components/sui/tree/master/packages/sui-bundler#migrations)
 
- Removed support for legacy props `i18n`, `browser` and `domain`. Instead, use the `context` prop so you could pass directly the context object you want to use on your Widgets.

```diff
-      <Widget
-        browser={browser}
-        domain={domain}
-        i18n={i18n}
-        selector="#widget-userCommunicationsMessage">
+      <Widget context={context} selector="#widget-userCommunicationsMessage">
```

- Removed `node` prop that indicates where you want to create the React tree as the name was incorrect. Instead use `selector`.

```diff
-      <Widget node="#widget-id">
+      <Widget selector="#widget-id">
```

- Removed support for legacy React Context. If your widgets were using it, please, move to the new React Context.

- Removed `@s-ui/react-domain-connect` package. It added the legacy context support.

- `manualCompression` flag on your `sui-widget-embedder` config is not longer supported and it will be ignored. No more manual compression is supported.

```diff
-  "config": {
-    "sui-widget-embedder": {
-      "manualCompression": true
-    },
```

- New `react/jsx` is used so you don't need to import React from `react`. The generated files avoid that as well.

```diff
-import React from 'react'
import Widget from '@s-ui/widget-embedder/react/Widget'
import Widgets from '@s-ui/widget-embedder/react/Widgets'
```

- Now, only `.js` and `.json` extensions will be resolved if you ignore them on importing the file.

```js
// before
import util from './util' // finally, any extension will be handled as we're using * as a fallback
// after
import util from './util' // only .js and .json files will be resolved
```

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

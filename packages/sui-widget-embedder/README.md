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
- `manualCompression` [OPTIONAL] (default: false): Compress files manually with gzip and brotli to be served via CDN

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
  * `browser`: Browser object with useful info about the browser of the User Agent.
  * `children` *(required)*: Content of the Widget. Should be a compatible React Element.
  * `domain`: Domain library for your widgets
  * `i18n`: I18n library
  * `isVisible` *(default: true)*: Determine if the widget must be shown.
  * `node` *(deprecated)*: css path that indicates where you want create the new React tree. If that node doesnt exist in the current page you will get a warning in the console.
  * `renderMultiple` *(default: false)*: Determine if the Widget must be rendered on every node found using the selector prop (or deprecated `node` prop). If `false` the Widget will be rendered only in the first node found.
  * `selector`: *(required)* CSS Path to select the node (or nodes) where you want to render the Widget.

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

## Hot module replacement

In order to be able to use webpack's hot module replacement feature, you'll need to use the hot loader module inside your widget.js like this:

```js
import {hot} from 'react-hot-loader'

const YourAwesomeWidget = () => ...

export default hot(module)(YourAwesomeWidget) // don't worry about "module", it will work thanks to webpack
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

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

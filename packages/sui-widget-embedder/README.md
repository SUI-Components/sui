# sui-widget-embedder
> Widget development server and build for production

## Motivation

(1) Improve the DX for several widgets that work together; (2) Create an easy-to-use page application.

## Usage

## File structure

Your project must follow the following folder structure:

```
.
├── package.json <- Project package.json
└── widgets
    ├── detail
    │   ├── Gallery.js
    │   ├── ContactForm.js
    │   ├── index.js
    │   ├── index.scss
    │   └── package.json <- Page package.json
    └── list
        ├── index.js
        ├── Footer.scss
        ├── index.scss
        └── package.json <- Page package.json
```

## Configs

### project config

```
"config": {
  "sui-widget-embedder": {
    "remoteCdn": "http://cdn-widgets-vibbo-pro.surge.sh",
    "devPort": "2017",
    "target": "https://vibbo.com"
  }
}
```

Inside your project-level package.json, you must config the library,

* remoteCdn [REQUIRED]: the base path of the cdn where your assets will be located
* devPort [OPTIONAL] (DEFAULT=3000): Port where your development server will be listening
* target [REQUIRED]: protocol and host from the site that you want to develop

### page config

Inside each page you must create a packe.json file.

```
{
  "pathnameRegExp": "/d\\w+\\.html",
  "pathnameStatic": "/vivienda/malaga-capital/aire-acondicionado-terraza-trastero-ascensor-el-ejido-la-merced-la-victoria-144577108",
  "vendor": [
    "react",
    "react-dom"
  ]
}
```

* pathnameRegExp [REQUIRED]: RegExp to identify the pathname of the page where this list of widgets must work
* vendor [OPTIONAL]: In case you want to have a vendor file for this page only.
* pathnameStatic: You can avoid pass the pathname to the cli is you use this key in your page widget

# Working with React

sui-widget-embedder does not expect to work with React. But if you want to create your widgets as React trees in your page, there are 3 helper utilities:

```
import Widget from '@s-ui/widget-embedder/react/Widget'
import Widgets from '@s-ui/widget-embedder/react/Widgets'
import render from '@s-ui/widget-embedder/react/render'
```
* render: A method that expects a tree of React components starting with a Widgets root
* Widgets: React component that encapsules all your widgets
* Widget: React component that renders the children as a new React tree in another place of the page.
** i18n: I18n library
** domain: Domain library for your widgets
** node: css path that indicates where you want create the new React tree. If that node doesnt exist in the current page you will get a warning in the console.

## Installation

```sh
npm install @s-ui/widget-embedder --save
```

# CLI

```
$ sui-widget-embedder dev -p detail
```

Now you can go to `localhost:[port_setting]` and navegate inside the page with a proxy enabled

```
$ sui-widget-embedder dev -p detail /vivienda/malaga-capital/aire-acondicionado-terraza-trastero-ascensor-el-ejido-la-merced-la-victoria-144577108
```
When you provide a path like last argument to the CLI you must go to `localhost:[port_setting]/static` to have a static version of the page

# How to build

If you want to get the remoteCdn from package config you just need to do that:

```
$ sui-widget-embedder build
```

If you want to define the remoteCdn by command option you can pass it using the param -R or --remoteCdn

```
$ sui-widget-embedder build -R http://mycdn.com
```

# Generator

If you don't want to take care about base code and folder creation of a new widget you can use the sui-widget-embedder-generator

```
$ sui-widget-embedder generate <widgetName>
```

This will create the base files to make your widget work.

You can also define the regExp that should match to load your widget into the page doing the follow:

```
$ sui-widget-embedder generate <widgetName> -E 'expression'
```

Note that the quotes here are not 'optional' you can add an expresion without quotes off course but you'll need to escape all the chars that are interpretable by the terminal.

## Hot module replacement

In order to be able to use webpack's hot module replacement feature, you'll need to use the hot loader module inside your widget.js like this:

```js
import {hot} from 'react-hot-loader'

const YourAwesomeWidget = () => ...

export default hot(module)(YourAwesomeWidget) // don't worry about "module", it will work thanks to webpack
```

## Load widget on the fly without proxy

>Useful for pages that require to be authenticated

In case you want to load your widget in a site, you need to follow these steps:

1. Launch your widget server
2. Create a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) with this snippet

```js
javascript:(function(i,s,o,g,r,a,m){a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','http://localhost:3000/bundle.js','ga');
```

Check that the snippet is setting the right **port** to your widget server. The default port is 3000

3. Open the site in which you want to run your widgets
4. Run the bookmarklet, the widget will render itself within the element set

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

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
    "cdn": "http://cdn-widgets-vibbo.surge.sh",
    "devPort": "2017",
    "target": "https://vibbo.com"
  }
}
```

Inside your project-level package.json, you must config the library,

* cdn [REQUIRED]: the base path of the cdn where your assets will be located
* devPor [OPTIONAL] (DEFAULT=3000): Port where your development server will be listening
* target [REQUIRED]: protocol and host from the site that you want to develop

### page config

Inside each page you must create a packe.json file.

```
{
  "pathnameRegExp": "/d\\w+\\.html",
  "vendor": [
    "react",
    "react-dom"
  ]
}
```

* pathnameRegExp [REQUIRED]: RegExp to identify the pathname of the page where this list of widgets must work
* vendor [OPTIONAL]: In case you want to have a vendor file for this page only.

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
** node: css path that indicates where you want create the new React tree

## Installation

```sh
npm install @s-ui/widget-embedder --save
```

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

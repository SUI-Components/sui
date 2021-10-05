# @s-ui/js-compiler

> Compile your JavaScript and JSX files to be compatible with the browsers

It provides:
* Unified code transformation.
* Usage of SWC to compile files faster.

## Installation

```sh
$ npm install @s-ui/js-compiler --save-dev
```

## Usage

### Via `package.json` (Recommended)

```json
"scripts": {
  "prepare": "sui-js-compiler"
}
```

### Via CLI

```sh
$ ./node_modules/.bin/sui-js-compiler
```

## Requirements

Automatically, `@s-ui/js-compiler` searches for `/src` folder and outputs the compiled files to `/lib`.

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).a

# @s-ui/js-compiler

> Compile your JavaScript and JSX files to be compatible with the browsers

It provides:

- Unified code transformation.
- Usage of SWC to compile files faster.

## Installation

```sh
$ npm install @s-ui/js-compiler --save-dev
```

## Usage

### Via `package.json` (Recommended)

```json
"scripts": {
  "prepublishOnly": "sui-js-compiler"
}
```

### Via CLI

```sh
$ ./node_modules/.bin/sui-js-compiler
```

### Options

| Option     | Type           | Default | Description                                                               |
| ---------- | -------------- | ------- | ------------------------------------------------------------------------- |
| `--ignore` | string \| glob | -       | Takes all the pattern comma separated and ignore them during compilation. |
| `--modern` | boolean        | -       | Transpile using modern browser targets.                                   |

```sh
$ ./node_modules/.bin/sui-js-compiler --ignore=./src/**/*.test.js
```

```sh
$ ./node_modules/.bin/sui-js-compiler --modern
```

#### Compiling TypeScript files and generating type declarations

This tools lets you compile **TS files** and generate their **type declarations** in your packages out of the box. It will do it if the package itself has a `tsconfig.json` placed in its root folder.

## Requirements

Automatically, `@s-ui/js-compiler` searches for `/src` folder and outputs the compiled files to `/lib`.

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

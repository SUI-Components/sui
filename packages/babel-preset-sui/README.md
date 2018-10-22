# babel-preset-sui

> A preset for all babel-transpiled javascript of the SUI family.

It provides:
* Unified code transformations.
* Protection on arbitrary use of experimental features that may been deprecated.

## Installation

```sh
$ npm install babel-preset-sui --save-dev
```

## Presets and plugins

This preset always includes the following plugins and presets:
- [babel-preset-env](https://www.npmjs.com/package/babel-preset-env)
- [babel-plugin-transform-async-generator-functions](https://www.npmjs.com/package/babel-plugin-transform-async-generator-functions)
- [babel-plugin-transform-decorators-legacy](https://www.npmjs.com/package/babel-plugin-transform-decorators)
- [babel-plugin-transform-class-properties](https://www.npmjs.com/package/babel-plugin-transform-class-properties)
- [babel-plugin-transform-object-rest-spread](https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread)
- [babel-plugin-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime)
- [babel-plugin-syntax-dynamic-import](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import)
- [babel-plugin-transform-export-extensions](https://www.npmjs.com/package/babel-plugin-transform-export-extensions)
- [babel-plugin-transform-react-remove-prop-types](https://www.npmjs.com/package/babel-plugin-transform-react-remove-prop-types)

If `react` or `preact` is installed:
  - [babel-preset-react](https://www.npmjs.com/package/babel-preset-react)
  - [react-hot-loader/babel](https://www.npmjs.com/package/react-hot-loader)

## Usage

### Via `package.json` (Recommended)

**package.json**

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "babel": {
    "presets": ["sui"]
  }
}
```

### Via `.babelrc`

**.babelrc**

```json
{
  "presets": ["sui"]
}
```

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

# sui-babel-preset
> A preset for all babel-transpiled javascript of the SUI family.

It provides:
* Unified syntax rules.
* Protection on arbitrary use of experimental features that may been deprecated.

## Installation

```sh
$ npm install babel-preset-sui --save-dev
```

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

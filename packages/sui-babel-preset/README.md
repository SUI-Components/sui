# sui-babel-preset
> A preset for all babel-trnaspiled JS files.

It provides:
* Unified syntax rules.
* Protection on arbitrary use of experimental features that may been deprecated.

## Installation

```sh
$ npm install @schibstedspain/sui-babel-preset --save-dev
```

## Usage

### Via `package.json` (Recommended)

**package.json**

```json
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "babel": {
    "presets": ["schibsted-spain"]
  }
}
```

### Via `.babelrc`

**.babelrc**

```json
{
  "presets": ["schibsted-spain"]
}
```



## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

# sui-jest

This is a CLI that abstracts away all configuration for [Jest](https://jestjs.io/).

## Installation

```sh
npm install -D @s-ui/jest
```

## Usage

This CLI exposes a bin called `sui-jest` with all options that [Jest CLI Options](https://jestjs.io/docs/cli) supports.

**From node**

```sh
node ./node_modules/.bin/sui-jest [Jest CLI Options]
```

**From npm script**

```json
// package.json
{
  "scripts": {
    "test:jest": "sui-jest"
  }
}
```

```sh
npm run test:jest -- [Jest CLI Options]
```

### Overriding Config

`sui-jest` allows you to specify your own configuration. There are various ways that it works, but basically if you want to have your own config for something, just add the configuration and `sui-jest` will use it instead of its own internal config.

**Specific**

From CLI using the `--config` flag with the path of the specific jest config file.

```sh
node ./node_modules/.bin/sui-jest --config jest.config.[*]
```

**Automatic**

Create a `jest.config.[*]` config file in your root project or within the `packages/*`, and `sui-jest` will use the jest config file closest to where it has been executed.

```js
// jest.config.js

module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js']
  // ...
}
```

_In construction_

In addition, `sui-jest` will expose its basic configuration so you can use it and override only the parts of the config you need to.

## Inspiration

This is inspired by [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).

# sui-test

> Zero config testing tool

## Motivation

(1) Setup properly a testing env in JS is hard. There is a lot deps and is easy for us install differents setups in differents project. To avoid that now to run a test suit over your code you need install only one tool.

## Folder Structure

Your tests must be in a `test` folder in your project root. Each test file should follow the patter: `*Spec.js`.

```
.
├── package.json <- Project package.json
└── src
│   ├── detail.js
│   └── user.js
└── test
    ├── detail
    │   └── detailSpec.js
    └── user
        └── userSpec.js
```

## Installation

```sh
npm install @s-ui/test --save-dev
```

# CLI Options

```sh
  Usage: sui-test [options] [command]


  Options:

        --version  output the version number
    -h, --help     output usage information


  Commands:

    browser|b   Run tests in the browser
    server|s    Run tests in node
    help [cmd]  display help for [cmd]
```

## Browser options

```sh
  Usage: sui-test browser [options]


  Options:

    -W, --watch  Run in watch mode
    -C, --ci     Run a Firefox headless for CI testing
    -P, --pattern <pattern>               Path pattern to include (default: test/**/*Spec.js)
    -I, --ignore-pattern <ignorePattern>  Path pattern to ignore for testing (default: false)
    --src-pattern <srcPattern>  Define the source directory (default: src/**/*.js)
    -h, --help   output usage information
  Description:

  Run tests in Chorme

  Examples:

    $ sui-test browser
```

## Server options

```sh
  Usage: sui-test server [options]


    Options:

        -I, --inspect Inspect node process
        -W, --watch  Run in watch mode
        -T, --timeout Customize test timeout
        -P, --pattern <pattern>  Path pattern to include (default: test)
        -h, --help   output usage information
    Description:

    Run tests in node

    Examples:

      $ sui-test server -W
```

# Tools

## Descriptor by environment patcher
The descriptor by environment is a patch with the purpose of add some extra functionality to our mocha describe and it methods.

### How to import it?

First of all, the patcher MUST BE APPLIED on each test that we want to have the extra methods so at the top of `ourExampleSpec.js` we will add the next code:

```javascript
import { descriptorsByEnvironmentPatcher } from '@s-ui/test/lib/descriptor-environment-patcher'
descriptorsByEnvironmentPatcher()
```
And that's it, from that line you will have the next methods added to the base of the mocha lib:
- describe.client
- describe.server
- describe.client.only
- describe.server.only
- it.client
- it.server
- it.client.only
- it.server.only
### How can I use it?
Just in the same way as you have been using the describe or it functions earlier:

```javascript
describe.client('Users use case', () => {
  it('should....', () => {
    // ...
  })
})

describe.server('Users use case', () => {
  it('should....', () => {
    // ...
  })
})
```

You can also have `it()` by environment:

```javascript
describe('Another use case', () => {
  it.client('should....', () => {
    // ...
  })

  it.server('should....', () => {
    // ...
  })
})
```

What about if you want to run only one describe but only for client? You can use the `.only` function in the same way as you've been using earlier.

```javascript
describe.client.only('Another use case', () => {
  it('should....', () => {
    // ...
  })
})
```
## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

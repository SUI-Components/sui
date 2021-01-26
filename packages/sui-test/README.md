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

## e2e tests

```
sui-test e2e [options]
```

**`sui-test e2e` assumes that your e2e tests are located in the `./test-e2e/` folder of your project.**

**Important:** If you need to have fixtures files (or helpers), put them in the `./test-e2e/fixtures` so they aren't executed as spec files.

### Support files

If you need to have support files, then create a `./test-e2e/support` directory, it will be detected and added to the `cypress.json` configuration.

Support files runs before every single spec file and you don't have to import it in spec file.

Example:

`./test-e2e/support/index.js`

```js
/* globals Cypress, cy */
Cypress.Commands.add('login', () => {
  // Here the command code
})
```

Then you can use in your specs `cy.login()`

### Options

```sh
  Usage: sui-test-e2e [options]


  Options:

    -B, --baseUrl <baseUrl>                  URL of the site to execute tests (in ./test/e2e/) on.
    -S, --screenshotsOnError                 Take screenshots of page on any failure.
    -U, --userAgentAppend <userAgentAppend>  Append string to UserAgent header.
    -UA, --userAgent <userAgent>             Overwrite string to UserAgent header.
    -G, --gui                                Run the tests in GUI mode.
    -C, --ci                                 CI Mode, reduces memory consumption
    -h, --help                               output usage information
    -b, --browser <browser>                  Select a different browser (chrome|edge|firefox)
    -N, --noWebSecurity                      Disable all web securities (CORS)
    -K, --key                                It is used to authenticate the project into the Dashboard Service
    -P, --parallel                           Run tests on parallel
    -R, --record                             Record tests and send result to Dashboard Service
```

#### `sui-test e2e --gui`

Tests are executed with [cypress](https://www.cypress.io/). It provides a special GUI to help you write your tests with a totally new experiences.

![cypress](https://docs.cypress.io/img/guides/first-test-click-revert.516ad69d.png)

[Check the docs for more info](https://docs.cypress.io/guides/overview/why-cypress.html#).

**Important:** Cypress is not installed as dependency of `@s-ui/test`. It will be auto-installed only on first `sui-test e2e` execution.

#### `sui-test e2e --scope='sub/folder'`

You can execute only a subset of tests in `./test-e2e/`. The example above would only execute tests in `./test-e2e/sub/folder`.

#### `sui-test e2e --userAgent='My custom string'`

Cypress can be detected as a robot if your server has that kind of protection or firewall. In this case, if your server allows an exception by header, you can overwrite the `UserAgent` header a string that cypress will set when opening your site with the browser.

#### `sui-test e2e --userAgentAppend='My custom string'`

Cypress can be detected as a robot if your server has that kind of protection or firewall. In this case, if your server allows an exception by header, you can append to the `UserAgent` header a string that cypress will add when opening your site with the browser.

#### `sui-test e2e --screenshotsOnError`

If defined, any error on your tests will create a screenshot of that moment in the `./.tmp/test-e2e/screenshots` folder of your project.

# Config

`@s-ui/test` could use a `config` in your `package.json` to tweak some behaviors. These are

- `server`: Config for `@s-ui/test server` binary:
  - `forceTranspilation`: List of regexs (string based, later will be transformed with `new Regex`) of modules to transpile. This is useful in case you're using server tests for modules that are ESModules based and need to be transpiled with `@babel/plugin-transform-modules-commonjs`.

```json
"config": {
  "sui-test": {
    "server": {
      "forceTranspilation": ["@adv-ui/vendor-by-consents-loader"]
    }
  }
}
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

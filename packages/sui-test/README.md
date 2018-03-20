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
npm install @s-ui/test
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

        -W, --watch  Run in watch mode
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

### Options

```sh
  Usage: sui-test-e2e [options]


  Options:

    -B, --baseUrl <baseUrl>                  URL of the site to execute tests (in ./test/e2e/) on.
    -S, --screenshotsOnError                 Take screenshots of page on any failure.
    -U, --userAgentAppend <userAgentAppend>  Append string to UserAgent header.
    -G, --gui                                Run the tests in GUI mode.
    -h, --help                               output usage information
```

#### `sui-test e2e --gui`

Tests are executed with [cypress](https://www.cypress.io/). It provides a special GUI to help you write your tests with a totally new experiences.

![cypress](https://docs.cypress.io/img/guides/first-test-click-revert.516ad69d.png)

[Check the docs for more info](https://docs.cypress.io/guides/overview/why-cypress.html#).

**Important:** Cypress is not installed as dependnency of `@s-ui/test`. It will be auto-installed only on first `sui-test e2e` execution.

#### `sui-test e2e --userAgentAppend='My custom string'`

Cypress can be detected as a robot if your server has that kind of protection or firewall. In this case, if your server allows an exception by header, you can append to the `UserAgent` header a string that cypress will add when opening your site with the browser.

#### `sui-test e2e --screenshotsOnError`

If defined, any error on your tests will create a screenshot of that moment in the `./.tmp/test-e2e/screenshots` folder of your project.

## Contributing

Please refer to the [main repo contributing info](https://github.com/SUI-Components/sui/blob/master/CONTRIBUTING.md).

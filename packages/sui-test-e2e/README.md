# sui-test-e2e

> Zero config e2e testing tool

## Folder Structure

All your e2e tests must be in a folder in your project, expecting by default to be in the root as `./test-e2e` but it can be renamed with the process env variable `E2E_FOLDER`. Each test file should follow the pattern: `*Spec.js`.

```
.
├── package.json <- Project package.json
└── src
│   ├── detail.js
│   └── user.js
└── test-e2e
    ├── fixtures
    │   └── literals.js
    ├-─
    └── user
        └── userSpec.js
```

**Important:** If you need to have fixtures files (or helpers), put them in the `./test-e2e/fixtures` so they aren't executed as spec files.

## How to use

Executing with `npx` is preferred, to install dependencies only when needed.

```sh
npx @s-ui/test-e2e
```

Options:

```
Usage: sui-test-e2e [options]

Options:
      --version                            output the version number
  -B, --baseUrl <baseUrl>                  URL of the site to execute tests (in ./test-e2e/) on.
  -T, --defaultCommandTimeout <ms>         Time, in milliseconds, to wait until most DOM based commands are considered timed out.
  -S, --screenshotsOnError                 Take screenshots of page on any failure.
  -U, --userAgentAppend <userAgentAppend>  Append string to UserAgent header.
  -UA, --userAgent <userAgent>             Overwrite string to UserAgent header.
  -s, --scope <spec>                       Run tests specifying a subfolder of specs
  -b, --browser <browser>                  Select a different browser (chrome|edge|firefox)
  -H, --headless                           Hide the browser instead of running headed (default for Electron)
  -N, --noWebSecurity                      Disable all web securities
  -G, --gui                                Run the tests in GUI mode.
  -P, --parallel                           Run tests on parallelRun tests on parallel
  -R, --record                             Record tests and send result to Dashboard Service
  -C, --ci                                 Continuous integration mode, reduces memory consumption
  -VH, --viewportHeight                    Sets custom viewport height
  -VW, --viewportWidth                     Sets custom viewport width
  -K, --key <key>                          It is used to authenticate the project into the Dashboard Service
  --group                                  Combines tests in different groups
  -h, --help                               display help for command

  Description:
    Run end-to-end tests with Cypress

  Examples:
    $ sui-test-e2e --baseUrl=http://www.github.com
    $ sui-test-e2e --baseUrl=http://www.github.com --gui
    $ E2E_FOLDER="my-custom-folder" sui-test-e2e --baseUrl=http://www.github.com
```

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

You can make use of `@s-ui/test-e2e/lib/add-commands` to extend from `@testing-library/cypress` commands.

Example:

```js
// ./test-e2e/support/index.js

import '@s-ui/test-e2e/lib/add-commands'

// Rest of your custom commands

// ./test-e2e/integration/yourAwesomeTest.js

cy.findByText()
```

[More info here](https://testing-library.com/docs/cypress-testing-library/intro/)

### Plugin files

If you need to have plugins, then create a `./test-e2e/plugins` directory, it will be detected and added to the `cypress.json` configuration.

Plugins enable you to tap into, modify, or extend the internal behavior of Cypress.

Example:

`./test-e2e/plugins/index.js`

```js
module.exports = (on, config) => {
  /**
   * @see https://docs.cypress.io/api/plugins/browser-launch-api.html#Usage
   */
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-dev-shm-usage')
    }
    return launchOptions
  })
}
```

#### `sui-test-e2e --gui`

Tests are executed with [Cypress](https://www.cypress.io/). It provides a special GUI to help you write your tests with a totally new experiences.

[Check the docs for more info](https://docs.cypress.io/guides/overview/why-cypress.html#).

#### `sui-test e2e --scope='sub/folder'`

You can execute only a subset of tests in `./test-e2e/`. The example above would only execute tests in `./test-e2e/sub/folder`.

#### `sui-test-e2e --userAgent='My custom string'`

Cypress can be detected as a robot if your server has that kind of protection or firewall. In this case, if your server allows an exception by header, you can overwrite the `UserAgent` header a string that cypress will set when opening your site with the browser.

#### `sui-test-e2e --userAgentAppend='My custom string'`

Cypress can be detected as a robot if your server has that kind of protection or firewall. In this case, if your server allows an exception by header, you can append to the `UserAgent` header a string that cypress will add when opening your site with the browser.

#### `sui-test-e2e --screenshotsOnError`

If defined, any error on your tests will create a screenshot of that moment in the `./.tmp/test-e2e/screenshots` folder of your project.

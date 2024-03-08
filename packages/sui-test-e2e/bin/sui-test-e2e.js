#!/usr/bin/env node
/* eslint no-console:0 */

import {existsSync, writeFileSync} from 'fs'
import {createRequire} from 'module'
import {join} from 'path'

import program from 'commander'
import cypress from 'cypress'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

const CWD = process.cwd()
const TESTS_FOLDER = `${CWD}/${process.env.E2E_FOLDER ?? 'test-e2e'}`
const SCREENSHOTS_FOLDER = `${CWD}/.tmp/test-e2e/screenshots`
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 Chrome/65.0.3325.146 Safari/537.36'
const DEFAULT_CYPRESS_CONFIG = {
  fixturesFolder: false,
  e2e: {},
  trashAssetsBeforeRuns: true,
  videoUploadOnPasses: false,
  viewportWidth: 1240,
  viewportHeight: 960
}

const DEFAULT_CYPRESS_CONFIG_FILE_CONTENT = `module.exports = {
  e2e: {}
};`

const CYPRESS_CONFIG_FILE_WITH_LEGACY_PLUGINS = `const plugins = require('./plugins/index.js')
module.exports = {
  e2e: {
    setupNodeEvents: plugins
  }
};`

const HELP_MESSAGE = `
  Description:
    Run end-to-end tests with Cypress

  Examples:
    $ sui-test-e2e --baseUrl=http://www.github.com
    $ sui-test-e2e --baseUrl=http://www.github.com --gui`

const supportFilesFolderPath = join(TESTS_FOLDER, 'support')
const pluginsFilesFolderPath = join(TESTS_FOLDER, 'plugins')

program
  .version(version, '    --version')
  .option('-B, --baseUrl <baseUrl>', 'URL of the site to execute tests (in ./test-e2e/) on.')
  .option(
    '-T, --defaultCommandTimeout <ms>',
    'Time, in milliseconds, to wait until most DOM based commands are considered timed out.'
  )
  .option('-S, --screenshotsOnError', 'Take screenshots of page on any failure.', false)
  .option('-U, --userAgentAppend <userAgentAppend>', 'Append string to UserAgent header.')
  .option('-UA, --userAgent <userAgent>', 'Overwrite string to UserAgent header.')
  .option('-s, --scope <spec>', 'Run tests specifying a subfolder of specs')
  .option('-b, --browser <browser>', 'Select a different browser (chrome|edge|firefox)')
  .option('-H, --headless', 'Hide the browser instead of running headed (default for Electron)')
  .option('-N, --noWebSecurity', 'Disable all web securities')
  .option('-G, --gui', 'Run the tests in GUI mode.')
  .option('-P, --parallel', 'Run tests on parallelRun tests on parallel')
  .option('-R, --record', 'Record tests and send result to Dashboard Service', false)
  .option('-C, --ci', 'Continuous integration mode, reduces memory consumption')
  .option('-VH, --viewportHeight <viewportHeight>', 'Sets custom viewport height')
  .option('-VW, --viewportWidth <viewportWidth>', 'Sets custom viewport width')
  .option('-K, --key <key>', 'It is used to authenticate the project into the Dashboard Service')
  .option('-V, --video', 'Enable video recording', false)
  .option('--group', 'Combines tests in different groups')
  .on('--help', () => console.log(HELP_MESSAGE))
  .parse(process.argv)

const {
  baseUrl,
  defaultCommandTimeout,
  browser,
  ci,
  group,
  gui,
  key,
  headless,
  noWebSecurity,
  parallel,
  record,
  scope = '/integration/',
  screenshotsOnError,
  userAgent,
  userAgentAppend,
  video,
  viewportHeight,
  viewportWidth
} = program.opts()

// Since Cypress 10, integrationFolder param becomes a file pattern
const scopePattern = `${scope}/**/*.js`

const cypressConfig = {
  ...DEFAULT_CYPRESS_CONFIG,
  specPattern: join(TESTS_FOLDER, scopePattern || ''),
  baseUrl,
  fixturesFolder: join(TESTS_FOLDER, 'fixtures'),
  video,
  retries: {
    runMode: 1,
    openMode: 1
  }
}

if (defaultCommandTimeout) {
  cypressConfig.defaultCommandTimeout = +defaultCommandTimeout
}

if (existsSync(supportFilesFolderPath)) {
  cypressConfig.e2e.supportFile = `${supportFilesFolderPath}/index.js`
}

if (userAgent) {
  cypressConfig.userAgent = `"${userAgent}"`
} else if (userAgentAppend) {
  cypressConfig.userAgent = `"${DEFAULT_USER_AGENT} ${userAgentAppend}"`
}

if (viewportHeight) {
  cypressConfig.viewportHeight = Number(viewportHeight)
}

if (viewportWidth) {
  cypressConfig.viewportWidth = Number(viewportWidth)
}

if (screenshotsOnError) {
  cypressConfig.screenshotOnRunFailure = true
  cypressConfig.screenshotsFolder = SCREENSHOTS_FOLDER
}

if (ci) {
  cypressConfig.watchForFileChanges = false
  cypressConfig.numTestsKeptInMemory = 1
}

if (noWebSecurity) cypressConfig.chromeWebSecurity = false

const configFilePath = join(TESTS_FOLDER, 'cypress.config.js')

if (!existsSync(configFilePath)) {
  const configFileContent = existsSync(pluginsFilesFolderPath)
    ? CYPRESS_CONFIG_FILE_WITH_LEGACY_PLUGINS
    : DEFAULT_CYPRESS_CONFIG_FILE_CONTENT
  writeFileSync(configFilePath, configFileContent)
}

const cypressExecutableConfig = {
  config: cypressConfig,
  configFile: configFilePath,
  key,
  group,
  browser,
  headless,
  parallel,
  record,
  video
}

;(gui ? cypress.open(cypressExecutableConfig) : cypress.run(cypressExecutableConfig))
  .then(result => {
    if (result.failures) {
      console.error('Could not execute tests:')
      console.error(result.message)
      process.exit(result.failures)
    }

    // print test results and exit
    // with the number of failed tests as exit code
    process.exit(result.totalFailed)
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })

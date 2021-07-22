#!/usr/bin/env node
/* eslint no-console:0 */

import {join} from 'path'
import program from 'commander'
import {existsSync} from 'fs'
import {createRequire} from 'module'
import cypress from 'cypress'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

const CWD = process.cwd()
const TESTS_FOLDER = `${CWD}/test-e2e`
const SCREENSHOTS_FOLDER = `${CWD}/.tmp/test-e2e/screenshots`
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 Chrome/65.0.3325.146 Safari/537.36'
const DEFAULT_CYPRESS_CONFIG = {
  fixturesFolder: false,
  pluginsFile: false,
  supportFile: false,
  video: false,
  screenshotOnRunFailure: false,
  trashAssetsBeforeRuns: true,
  viewportWidth: 1240,
  viewportHeight: 960
}

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
  .option(
    '-B, --baseUrl <baseUrl>',
    'URL of the site to execute tests (in ./test-e2e/) on.'
  )
  .option(
    '-T, --defaultCommandTimeout <ms>',
    'Time, in milliseconds, to wait until most DOM based commands are considered timed out.'
  )
  .option(
    '-S, --screenshotsOnError',
    'Take screenshots of page on any failure.'
  )
  .option(
    '-U, --userAgentAppend <userAgentAppend>',
    'Append string to UserAgent header.'
  )
  .option(
    '-UA, --userAgent <userAgent>',
    'Overwrite string to UserAgent header.'
  )
  .option('-s, --scope <spec>', 'Run tests specifying a subfolder of specs')
  .option(
    '-b, --browser <browser>',
    'Select a different browser (chrome|edge|firefox)'
  )
  .option(
    '-H, --headless',
    'Hide the browser instead of running headed (default for Electron)'
  )
  .option('-N, --noWebSecurity', 'Disable all web securities')
  .option('-G, --gui', 'Run the tests in GUI mode.')
  .option('-P, --parallel', 'Run tests on parallelRun tests on parallel')
  .option('-R, --record', 'Record tests and send result to Dashboard Service')
  .option('-C, --ci', 'Continuous integration mode, reduces memory consumption')
  .option('-VH, --viewportHeight', 'Sets custom viewport height')
  .option('-VW, --viewportWidth', 'Sets custom viewport width')
  .option(
    '-K, --key <key>',
    'It is used to authenticate the project into the Dashboard Service'
  )
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
  scope,
  screenshotsOnError,
  userAgent,
  userAgentAppend,
  viewportHeight,
  viewportWidth
} = program.opts()

const cypressConfig = {
  ...DEFAULT_CYPRESS_CONFIG,
  integrationFolder: join(TESTS_FOLDER, scope || ''),
  baseUrl,
  fixturesFolder: join(TESTS_FOLDER, 'fixtures')
}

if (defaultCommandTimeout) {
  cypressConfig.defaultCommandTimeout = +defaultCommandTimeout
}

if (existsSync(supportFilesFolderPath)) {
  cypressConfig.supportFile = supportFilesFolderPath
}

if (existsSync(pluginsFilesFolderPath)) {
  cypressConfig.pluginsFile = pluginsFilesFolderPath
}

if (userAgent) {
  cypressConfig.userAgent = `"${userAgent}"`
} else if (userAgentAppend) {
  cypressConfig.userAgent = `"${DEFAULT_USER_AGENT} ${userAgentAppend}"`
}

if (viewportHeight) {
  cypressConfig.viewportHeight = viewportHeight
}

if (viewportWidth) {
  cypressConfig.viewportWidth = viewportWidth
}

if (screenshotsOnError) {
  cypressConfig.screenshotOnHeadlessFailure = true
  cypressConfig.screenshotsFolder = SCREENSHOTS_FOLDER
}

if (ci) {
  cypressConfig.numTestsKeptInMemory = 1
  cypressConfig.numSnapshotsKeptInMemory = 1
}

if (key) cypressConfig.key = key
if (group) cypressConfig.group = group

if (noWebSecurity) cypressConfig.chromeWebSecurity = false

const cypressExecutableConfig = {
  config: cypressConfig,
  configFile: false,
  key,
  browser,
  headless,
  parallel,
  record
}

;(gui
  ? cypress.open(cypressExecutableConfig)
  : cypress.run(cypressExecutableConfig)
).catch(error => {
  console.error(error)
})

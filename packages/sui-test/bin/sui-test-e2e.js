#!/usr/bin/env node
/* eslint no-console:0 */

const path = require('path')
const os = require('os')
const program = require('commander')
const fs = require('fs')
const {getSpawnPromise, showError} = require('@s-ui/helpers/cli')
const {resolveLazyNPMBin} = require('@s-ui/helpers/packages')
const CYPRESS_VERSION = require(path.join(__dirname, '..', 'package.json'))
  .cypressVersion
const CYPRESS_FOLDER_PATH = path.resolve(__dirname, 'cypress')
const TESTS_FOLDER = process.cwd() + '/test-e2e'
const SCREENSHOTS_FOLDER = process.cwd() + '/.tmp/test-e2e/screenshots'
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 Chrome/65.0.3325.146 Safari/537.36'
const HELP_MESSAGE = `
  Description:
    Run end-to-end tests with Cypress

  Examples:
    $ sui-test e2e --baseUrl=http://www.github.com
    $ sui-test e2e --baseUrl=http://www.github.com --gui`

const objectToCommaString = obj =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join(',')

const supportFilesFolderPath = path.join(TESTS_FOLDER, 'support')
const pluginsFilesFolderPath = path.join(TESTS_FOLDER, 'plugins')

program
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
} = program
const cypressConfig = {
  integrationFolder: path.join(TESTS_FOLDER, scope || ''),
  baseUrl,
  fixturesFolder: path.join(TESTS_FOLDER, 'fixtures')
}

if (defaultCommandTimeout) {
  cypressConfig.defaultCommandTimeout = defaultCommandTimeout
}

if (fs.existsSync(supportFilesFolderPath)) {
  cypressConfig.supportFile = supportFilesFolderPath
}
if (fs.existsSync(pluginsFilesFolderPath)) {
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

let projectURI = CYPRESS_FOLDER_PATH
if (noWebSecurity) {
  const defaultConfig = require(path.join(CYPRESS_FOLDER_PATH, 'cypress.json'))
  const nextCypressConfig = {
    ...defaultConfig,
    chromeWebSecurity: false
  }

  const nextFolderPath = path.join(os.tmpdir(), '' + Date.now())
  fs.mkdirSync(nextFolderPath)
  fs.writeFileSync(
    path.join(nextFolderPath, 'cypress.json'),
    JSON.stringify(nextCypressConfig, null, 2),
    'utf8'
  )
  projectURI = nextFolderPath
}

resolveLazyNPMBin('cypress/bin/cypress', `cypress@${CYPRESS_VERSION}`)
  .then(cypressBinPath =>
    getSpawnPromise(cypressBinPath, [
      gui ? 'open' : 'run',
      '--config=' + objectToCommaString(cypressConfig),
      '--project=' + projectURI,
      key && '--key=' + key,
      browser && '--browser=' + browser,
      headless && '--headless',
      parallel && '--parallel',
      record && '--record'
    ])
  )
  .catch(showError)

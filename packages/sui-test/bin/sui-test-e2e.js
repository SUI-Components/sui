#!/usr/bin/env node
/* eslint no-console:0 */

const path = require('path')
const program = require('commander')
const fs = require('fs')
const {getSpawnPromise, showError} = require('@s-ui/helpers/cli')
const {resolveLazyNPMBin} = require('@s-ui/helpers/packages')
const CYPRESS_VERSION =
  require(path.join(__dirname, '..', 'package.json')).cypressVersion || '3.8.3'
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

program
  .option(
    '-B, --baseUrl <baseUrl>',
    'URL of the site to execute tests (in ./test-e2e/) on.'
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
  .option('-G, --gui', 'Run the tests in GUI mode.')
  .option('-R, --record', 'Record tests and send result to Dashboard Service')
  .option(
    '-K, --key <key>',
    'It is used to authenticate the project into the Dashboard Service'
  )
  .on('--help', () => console.log(HELP_MESSAGE))
  .parse(process.argv)

const {
  baseUrl,
  userAgentAppend,
  userAgent,
  gui,
  screenshotsOnError,
  scope,
  record,
  key
} = program
const cypressConfig = {
  integrationFolder: path.join(TESTS_FOLDER, scope || ''),
  baseUrl,
  fixturesFolder: path.join(TESTS_FOLDER, 'fixtures')
}

if (fs.existsSync(supportFilesFolderPath)) {
  cypressConfig.supportFile = supportFilesFolderPath
}

if (userAgent) {
  cypressConfig.userAgent = `"${userAgent}"`
} else if (userAgentAppend) {
  cypressConfig.userAgent = `"${DEFAULT_USER_AGENT} ${userAgentAppend}"`
}

if (screenshotsOnError) {
  cypressConfig.screenshotOnHeadlessFailure = true
  cypressConfig.screenshotsFolder = SCREENSHOTS_FOLDER
}

resolveLazyNPMBin('cypress/bin/cypress', `cypress@${CYPRESS_VERSION}`)
  .then(cypressBinPath =>
    getSpawnPromise(cypressBinPath, [
      gui ? 'open' : 'run',
      '--config=' + objectToCommaString(cypressConfig),
      '--project=' + CYPRESS_FOLDER_PATH,
      record && '--record',
      key && '--key=' + key
    ])
  )
  .catch(showError)

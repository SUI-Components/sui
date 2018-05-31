#!/usr/bin/env node
/* eslint no-console:0 */

const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const {getSpawnPromise, showError} = require('@s-ui/helpers/cli')

const CYPRESS_VERSION = '2.1.0'
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
  .option('-G, --gui', 'Run the tests in GUI mode.')
  .on('--help', () => console.log(HELP_MESSAGE))
  .parse(process.argv)

const {baseUrl, userAgentAppend, gui, screenshotsOnError} = program
const cypressConfig = {integrationFolder: TESTS_FOLDER, baseUrl}

if (userAgentAppend) {
  cypressConfig.userAgent = `${DEFAULT_USER_AGENT} ${userAgentAppend}`
}

if (screenshotsOnError) {
  cypressConfig.screenshotOnHeadlessFailure = true
  cypressConfig.screenshotsFolder = SCREENSHOTS_FOLDER
}

// Resolve path for cypress in current working directory
const resolveCypressBin = () =>
  require.resolve('cypress/bin/cypress', {
    paths: [path.resolve(process.cwd(), 'node_modules')]
  })

// Get cypress bin path. If not found, install cypress and then return its path
const getCypressBinPath = async () => {
  try {
    return Promise.resolve(resolveCypressBin())
  } catch (e) {
    console.log(
      chalk.magenta(
        'It looks like this is your first time using sui-test e2e.' +
          '\nCypress will be installed to setup your project for end-to-end testing.'
      )
    )
    return getSpawnPromise('npm', [
      'install',
      `cypress@${CYPRESS_VERSION}`
    ]).then(resolveCypressBin)
  }
}

getCypressBinPath()
  .then(cypressBinPath =>
    getSpawnPromise(cypressBinPath, [
      gui ? 'open' : 'run',
      '--config=' + objectToCommaString(cypressConfig),
      '--project=' + CYPRESS_FOLDER_PATH
    ])
  )
  .catch(showError)

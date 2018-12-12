#!/usr/bin/env node
/* eslint no-console:0 */

const checkForUpdate = require('update-check')
const chalk = require('chalk')
const program = require('commander')
const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command('components', 'Update several metrics about sui-components')

program.parse(process.argv)
;(async () => {
  let update
  try {
    update = await checkForUpdate(pkg)
  } catch (err) {
    console.error(`Failed to check for updates: ${err}`)
  }

  if (update) {
    console.log(
      chalk.gray(
        `The latest version of ${require('../package.json').name} is ${
          update.latest
        }. Please update!`
      )
    )
  }
})()

#!/usr/bin/env node
/* eslint no-console:0 */

const path = require('path')
const program = require('commander')
const config = require('../src/config')
const { serialSpawn } = require('@schibstedspain/sui-helpers/cli')
const PACKAGES_DIR = path.join(process.cwd(), config.getPackagesFolder())
const cwds = config.getScopes().map(pkg => path.join(PACKAGES_DIR, pkg))

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Runs the given command on all the packages')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono run npm i')
    console.log('    $ sui-mono --help')
    console.log('    $ sui-mono -h')
    console.log('')
  })
  .parse(process.argv)

serialSpawn(cwds.map(getTaskArray))
  .then(code => process.exit(code))
  .catch(code => process.exit(code))

function getTaskArray (cwd) {
  const [command] = program.args
  const args = process.argv.slice(process.argv.indexOf(command) + 1)
  return [command, args, {cwd}]
}

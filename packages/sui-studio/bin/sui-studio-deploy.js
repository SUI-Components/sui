#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const { getSpawnPromise } = require('@schibstedspain/sui-helpers/cli')

program
  .usage('-n my-components')
  .option('-n, --name <name>', 'Name of the domain')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Build current studio and deploy to new.sh')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio deploy --name=my-domain')
    console.log('    $ NOW_TOKEN=my-token sui-studio deploy --name=my-domain')
    console.log('')
  })
  .parse(process.argv)

if (typeof program.name !== 'string') {
  console.log('ERR: --name flag is mandatory')
  process.exit(1)
}

const deployName = program.name

getSpawnPromise('now', ['rm', deployName, '--yes', '-t ${NOW_TOKEN}'])
  .catch(() => {}) // This will return error on the first deploy
  .then(() => getSpawnPromise(
    'now', ['./public', '--name=' + deployName, '--static', '-t ${NOW_TOKEN}']
  ))
  .then(code => process.exit(code))
  .catch(code => process.exit(code))

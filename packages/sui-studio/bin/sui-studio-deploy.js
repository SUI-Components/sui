#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const {getSpawnPromise, showError} = require('@s-ui/helpers/cli')
const BUILD_FOLDER = './public'
const DEPLOY_PATH = require.resolve('@s-ui/deploy/bin/sui-deploy')

program
  .usage('-n my-components')
  .option('-n, --name <name>', 'Name of the domain')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Deploy current build of the studio to now.sh')
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

if (!process.env.NOW_TOKEN) {
  console.log('ERR: NOW_TOKEN env variable is missing')
  process.exit(1)
}

getSpawnPromise(DEPLOY_PATH, ['spa', program.name, BUILD_FOLDER]).catch(err => {
  showError(err.message)
})

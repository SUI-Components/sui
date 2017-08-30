#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const clipboardy = require('clipboardy')
const { getSpawnPromise } = require('@schibstedspain/sui-helpers/cli')
const getDeployId = function (deployUrl, name) {
  let re = new RegExp(`https?://(${name}-[A-Za-z0-9]+).now.sh`, 'g')
  let result = re.exec(deployUrl)
  return result && result[1]
}

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

const deployName = program.name

getSpawnPromise('now', ['rm', deployName, '--yes', '-t $NOW_TOKEN'])
  .catch(() => {}) // To bypass now rm error on the first deploy
  .then(() => getSpawnPromise(
    'now', ['./public', '--name=' + deployName, '--static', '-t $NOW_TOKEN']
  ))
  // Obtain deployment url copied to clipboard by now
  .then(res => clipboardy.read())
  // Parse deployment name to make the alias point to it
  .then((deployUrl) => {
    let deployId = getDeployId(deployUrl, deployName)
    if (deployId) {
      return getSpawnPromise(
        'now', ['alias', deployId, deployName, '-t $NOW_TOKEN']
      )
    } else {
      console.error('Deploy crashed for ' + deployName)
      return 1
    }
  })
  .then(code => process.exit(code))
  .catch(code => process.exit(code))

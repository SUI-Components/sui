#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const NowClient = require('now-client')
const { getSpawnPromise } = require('@schibstedspain/sui-helpers/cli')
const {writeFile, removeFile} = require('./helpers/file')
const BUILD_FOLDER = './public'
const PKG_FILE = BUILD_FOLDER + '/package.json'
const writePackageJson = (name) => writeFile(PKG_FILE, `{
  "name": "@sui-studio/${name}",
  "scripts": {
    "start": "serve . --single"
  },
  "dependencies": {
    "serve": "latest"
  }
}`)

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

const deployName = program.name
const now = new NowClient(process.env.NOW_TOKEN)

getSpawnPromise('now', ['rm', deployName, '--yes', '-t $NOW_TOKEN'])
  .catch(() => {}) // To bypass now rm error on the first deploy
  .then(() => writePackageJson(deployName)) // Add package.json for SPA server
  .then(() => getSpawnPromise(
    'now', [BUILD_FOLDER, '--name=' + deployName, '--npm', '-t $NOW_TOKEN']
  ))
  .then(() => removeFile(PKG_FILE)) // Remove package.json only used by now.sh
  .then(() => now.getDeployments())
  .then(deployments => deployments[0].url)
  // Parse deployment name to make the alias point to it
  .then((deployId) => deployId
    ? getSpawnPromise('now', ['alias', deployId, deployName, '-t $NOW_TOKEN'])
    : Promise.reject(new Error('Deploy crashed for ' + deployName))
  )
  .catch(err => {
    console.log(err.message)
    process.exit(1)
  })

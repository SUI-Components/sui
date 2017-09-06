#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const NowClient = require('now-client')
const { getSpawnPromise } = require('@schibstedspain/sui-helpers/cli')
const {writeFile, removeFile} = require('@schibstedspain/sui-helpers/file')
const BUILD_FOLDER = './public'
const writePackageJson = (name) => writeFile(pkgFilePath, `{
  "name": "@sui-deploy/${name}",
  "scripts": {
    "start": "serve . --single"
  },
  "dependencies": {
    "serve": "latest"
  }
}`)

program
  .command('sui-deploy spa <name> <folder>')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Deploy build folder to now.sh')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-deploy spa my-app-name ./public')
    console.log('    $ NOW_TOKEN=my-token; sui-deploy spa my-app-name ./public')
    console.log('')
  })
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

if (!process.env.NOW_TOKEN) {
  console.log('ERR: NOW_TOKEN env variable is missing')
  process.exit(1)
}

const [,, deployName, folder = BUILD_FOLDER] = process.argv
const now = new NowClient(process.env.NOW_TOKEN)
const pkgFilePath = folder + '/package.json'

getSpawnPromise('now', ['rm', deployName, '--yes', '-t $NOW_TOKEN'])
  .catch(() => {}) // To bypass now rm error on the first deploy
  .then(() => writePackageJson(deployName)) // Add package.json for SPA server
  .then(() => getSpawnPromise(
    'now', [BUILD_FOLDER, '--name=' + deployName, '--npm', '-t $NOW_TOKEN']
  ))
  .then(() => removeFile(pkgFilePath)) // Remove package.json only used by now.sh
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

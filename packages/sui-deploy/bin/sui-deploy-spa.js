#!/usr/bin/env node
/* eslint no-console:0 no-template-curly-in-string:0 */

const program = require('commander')
const NowClient = require('now-client')
const { getSpawnPromise, showWarning } = require('@s-ui/helpers/cli')
const { writeFile, removeFile } = require('@s-ui/helpers/file')
const DEFAULT_FOLDER = './public'
const writePackageJson = name =>
  writeFile(
    pkgFilePath,
    `{
  "name": "@sui-deploy/${name}",
  "scripts": {
    "start": "serve . --single"
  },
  "dependencies": {
    "serve": "latest"
  }
}`
  )

program
  .usage(`[options] <name> [folder]`)
  .option('-n, --now', 'Deploy to now.sh')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Deploy build folder to now.sh')
    console.log('  [folder] defaults to ./public')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-deploy spa my-app-name ./dist')
    console.log('    $ NOW_TOKEN=my-token; sui-deploy spa my-app-name ./dist')
    console.log('')
  })
  .parse(process.argv)

if (!program.now) {
  console.log('ERR: --now is the only option avaiblable')
  process.exit(1)
}

const [deployName, buildFolder = DEFAULT_FOLDER] = program.args
const nowTokenOption = '-t $NOW_TOKEN'
const now = new NowClient(process.env.NOW_TOKEN)
const pkgFilePath = buildFolder + '/package.json'

showWarning(`Your are currently using a deprecated version of sui-deploy.`)
showWarning(
  `Please upgrade to version 2 or superior as soon as possible for SECURE deployments.`
)

getSpawnPromise('now', ['rm', deployName, '--yes', nowTokenOption])
  .catch(() => {}) // To bypass now rm error on the first deploy
  .then(() => writePackageJson(deployName)) // Add package.json for SPA server
  .then(() =>
    getSpawnPromise('now', [
      DEFAULT_FOLDER,
      '--name=' + deployName,
      '--npm',
      nowTokenOption
    ])
  )
  .then(() => removeFile(pkgFilePath)) // Remove package.json only used by now.sh
  .then(() => now.getDeployments())
  .then(deployments => deployments.filter(d => d.name === deployName)[0].url)
  // Parse deployment name to make the alias point to it
  .then(
    deployId =>
      deployId
        ? getSpawnPromise('now', [
          'alias',
          deployId,
          deployName,
          nowTokenOption
        ])
        : Promise.reject(new Error('Deploy crashed for ' + deployName))
  )
  .catch(err => {
    console.log(err.message || err)
    process.exit(1)
  })

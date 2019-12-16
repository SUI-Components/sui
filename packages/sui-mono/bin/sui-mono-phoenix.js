#!/usr/bin/env node
/* eslint no-console:0 */
require('colors')
const program = require('commander')
const {basename} = require('path')
const {default: Queue} = require('p-queue')
const logUpdate = require('log-update')

const config = require('../src/config')
const {serialSpawn, showError} = require('@s-ui/helpers/cli')

const DEFAULT_CHUNK = 20

program
  .option(
    '-c, --chunk <number>',
    `Execute by chunks of N packages (defaults to ${DEFAULT_CHUNK})`
  )
  .option(
    '--no-progress',
    'Force to not show progress of tasks (perfect for CI environments)'
  )
  .option('--no-audit', 'Avoid auditing packages for better performance')
  .on('--help', () => {
    console.log(`
  Description:
    Removes node_modules folder and reinstalls dependencies
    in all packages.
    Equivalent to 'npx rimraf node_modules && npm i' but works on any environment and
    executes it concurrently on each package (and/or on your project root folder).

  Examples:
    $ sui-mono phoenix`)
  })
  .parse(process.argv)

const RIMRAF_CMD = [
  require.resolve('rimraf/bin'),
  ['package-lock.json', 'node_modules']
]
const NPM_CMD = ['npm', ['install']]
const {audit, chunk = DEFAULT_CHUNK, progress} = program
const numberOfChunks = Number(chunk)
const queue = new Queue({concurrency: chunk})

const executePhoenixOnPackages = () => {
  if (config.isMonoPackage()) {
    return
  }

  config
    .getScopesPaths()
    .map(cwd => [
      [...RIMRAF_CMD, {cwd, stdio: 'ignore'}],
      [...NPM_CMD, {cwd, stdio: 'ignore'}]
    ])
    .map(commands =>
      queue.add(
        serialSpawn(commands).then(() => {
          const packageName = basename(commands[0][2].cwd).grey
          logUpdate(`Installed ${packageName}`)
        })
      )
    )
}

serialSpawn([RIMRAF_CMD, NPM_CMD])
  .then(executePhoenixOnPackages)
  .catch(showError)

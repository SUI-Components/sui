#!/usr/bin/env node
/* eslint no-console:0 */
require('colors')
const program = require('commander')
const {basename} = require('path')
const {default: Queue} = require('p-queue')
const logUpdate = require('log-update')

const config = require('../src/config')
const {serialSpawn, showError} = require('@s-ui/helpers/cli')

const DEFAULT_CHUNK = 5

program
  .option(
    '-c, --chunk <number>',
    `Execute by chunks of N packages (defaults to ${DEFAULT_CHUNK})`
  )
  .option(
    '--no-root',
    'Avoid executing the script on root folder in case you already did it'
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

const {audit, chunk = DEFAULT_CHUNK, progress = true, root} = program

const NPM_CMD = ['npm', ['install', audit ? '--no-audit' : '']]
const RIMRAF_CMD = [
  require.resolve('rimraf/bin'),
  ['package-lock.json', 'node_modules']
]
const rootExecution = root ? [RIMRAF_CMD, NPM_CMD] : []

const queue = new Queue({concurrency: +chunk})

const executePhoenixOnPackages = () => {
  if (config.isMonoPackage()) {
    return
  }

  const scopes = config.getScopesPaths()

  scopes.map(cwd => {
    const commands = [
      [...RIMRAF_CMD, {cwd, stdio: 'ignore'}],
      [...NPM_CMD, {cwd, stdio: 'ignore'}]
    ]

    queue
      .add(() => serialSpawn(commands))
      .then(() => {
        if (progress) {
          const {size, pending} = queue
          const packageName = basename(cwd).grey
          logUpdate(
            `Installed ${packageName}. ${size + pending}/${scopes.length}`
          )
        }
      })
      .catch(err => {
        console.error(err)
      })
  })

  return queue.onIdle().then(() => logUpdate('Installed all packages'))
}

serialSpawn(rootExecution)
  .then(executePhoenixOnPackages)
  .catch(showError)

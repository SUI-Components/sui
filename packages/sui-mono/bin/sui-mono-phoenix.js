#!/usr/bin/env node
/* eslint no-console:0 */
require('colors')
const program = require('commander')
const figures = require('figures')
const {basename} = require('path')
const {default: Queue} = require('p-queue')
const logUpdate = require('log-update')
const execa = require('execa')
const config = require('../src/config')

const DEFAULT_CHUNK = 5
/** NOTE:
 * Latest version of node & npm seems to have some concurrency problem
 * when installing packages. In order to be sure the CI deployment work as expected,
 * we're only installing one package at a time.
 * Related issue: https://github.com/npm/cli/issues/496
 */
const SINGLE_CHUNK = 1

const CI_FLAGS = [
  'loglevel=error',
  'no-audit',
  'no-fund',
  'no-optional',
  'no-package-lock',
  'no-progress',
  'no-save',
  'no-shrinkwrap',
  'prefer-offline',
  'production'
].map(flag => `--${flag}`)

program
  .option(
    '-c, --chunk <number>',
    `Execute by chunks of N packages (defaults to ${DEFAULT_CHUNK})`
  )
  .option(
    '--ci',
    'Optimized mode for CI. Avoid removing folders, showing progress, auditing, write package-lock files and more'
  )
  .option('--no-audit', 'Avoid auditing packages for better performance')
  .option(
    '--no-root',
    'Avoid executing the script on root folder in case you already did it'
  )
  .option(
    '--no-progress',
    'Force to not show progress of tasks (perfect for CI environments)'
  )
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

const {
  audit = true,
  chunk = DEFAULT_CHUNK,
  ci = false,
  progress = true,
  root = true
} = program

const NPM_CMD = ['npm', ['install', audit ? '' : '--no-audit']]
const RIMRAF_CMD = [
  require.resolve('rimraf/bin'),
  ['package-lock.json', 'node_modules']
]

/**
 * Execute needed commands to install packages
 * @param {Object} params
 * @param {string=} params.cwd
 * @param {string=} params.stdin
 */
const installPackages = ({cwd = undefined, stdin = 'inherit'} = {}) => {
  const executionParams = {cwd, stdin}
  if (ci) {
    const [npm] = NPM_CMD
    return execute([npm, ['install', ...CI_FLAGS]], executionParams)
  }

  return execute(RIMRAF_CMD, executionParams).then(() =>
    execute(NPM_CMD, executionParams)
  )
}

/**
 * Execute command abstraction
 * @param {Array<string | string[]>} cmd Array with the executable and the arguments to pass
 * @param {object} params
 * @param {string=} params.cwd
 * @param {string=} params.stdin
 */
const execute = (cmd, {cwd, stdin}) => {
  const [command, args] = cmd
  return execa(command, args, {cwd, stdin, stderr: 'inherit'})
}

const concurrency = ci ? SINGLE_CHUNK : Number(chunk)
const queue = new Queue({concurrency})
console.log(`Using concurrency of: ${concurrency}`)

const executePhoenixOnPackages = () => {
  // if we're on a monorepo, then we don't have packages to install
  if (config.isMonoPackage()) return

  const scopes = config.getScopesPaths()
  logUpdate(`${figures.play} Preparing ${scopes.length} packages to install...`)

  scopes.map(cwd => {
    const packageName = basename(cwd).grey
    queue
      .add(() => installPackages({cwd}))
      .then(() => {
        if (progress && !ci) {
          const {size, pending} = queue
          logUpdate(
            `${figures.play} ${packageName}: ${size + pending} of ${
              scopes.length
            } packages installed`
          )
        }
      })
      .catch(err => {
        console.error(`Error installing ${packageName}:`)
        console.error(err)
      })
  })

  return queue
    .onIdle()
    .then(() => logUpdate(`${figures.tick} Installed all packages`))
}

logUpdate(`${figures.play} Installing root packages...`)
;(root ? installPackages({stdin: 'inherit'}) : Promise.resolve())
  .then(executePhoenixOnPackages)
  .catch(error => {
    console.error(error)
  })

#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const {getSpawnPromise, parallelSpawn, showError} = require('@s-ui/helpers/cli')

const {checkIsMonoPackage, getWorkspaces} = require('../src/config')

const DEFAULT_CHUNK = 5

const CI_FLAGS = [
  'loglevel=error',
  'no-audit',
  'no-fund',
  'no-optional',
  'no-package-lock',
  'no-progress',
  'no-save',
  'no-shrinkwrap',
  'prefer-offline'
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
  .option('--production', 'Install only production packages')
  .option(
    '-s, --scope <string>',
    'Runs phoenix on a given scope, for example: -s atom/button'
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
  ci = Boolean(process.env.CI),
  progress = true,
  production = false,
  root = true,
  scope: scopeArgument
} = program

const NPM_BIN = 'npm'
const NPM_CMD = [
  NPM_BIN,
  [
    'install',
    '--loglevel=error',
    '--no-fund',
    audit ? '' : '--no-audit',
    production ? '--production' : '',
    progress ? '' : '--no-progress'
  ]
]
const RIMRAF_CMD = [
  require.resolve('rimraf/bin'),
  ['package-lock.json', 'node_modules']
]

console.log(`[sui-mono] Clean install ${scopeArgument || 'all'} packages`)
console.info(`[sui-mono] CI mode enabled: ${ci}`)

/**
 * Create needed commands to install packages
 * @param {string} cwd
 */
const createInstallPackagesCommand = (cwd = process.cwd()) => {
  const executionParams = {cwd}
  if (ci) {
    const commandArgs = [
      'install',
      ...CI_FLAGS,
      production ? '--production' : ''
    ]
    return [NPM_BIN, commandArgs, executionParams]
  }

  return [...NPM_CMD, executionParams]
}

/**
 * Install root packages
 * @return {Promise}
 */
const installRootPackages = async () => {
  if (!root) return Promise.resolve()

  console.log(`[sui-mono] Removing previous root packages...`)
  const [removeBin, removeArgs] = RIMRAF_CMD
  await getSpawnPromise(removeBin, removeArgs, {cwd: process.cwd()})

  console.log(`[sui-mono] Installing root packages...`)
  const [
    installBin,
    installArgs,
    installExecutionParams
  ] = createInstallPackagesCommand()
  await getSpawnPromise(installBin, installArgs, installExecutionParams)

  console.log('[sui-mono] Installed root packages')
}

const executePhoenixOnPackages = () => {
  if (checkIsMonoPackage()) return

  // get scopes only where a `npm install` is possible
  const scopes = getWorkspaces()

  const removePackagesCommands = scopes.map(cwd => [...RIMRAF_CMD, {cwd}])
  const installPackagesCommands = scopes.map(createInstallPackagesCommand)

  // if we're on CI, we don't need to remove folders
  const removeFoldersPromise = ci
    ? Promise.resolve()
    : parallelSpawn(removePackagesCommands, {
        chunks: chunk,
        title: 'rimraf'
      })

  // after cleaning node_modules folders, we install packages
  return removeFoldersPromise.then(() =>
    parallelSpawn(installPackagesCommands, {
      chunks: chunk,
      title: 'npm install'
    })
  )
}

installRootPackages()
  .then(executePhoenixOnPackages)
  .then(() => process.exit(0))
  .catch(showError)

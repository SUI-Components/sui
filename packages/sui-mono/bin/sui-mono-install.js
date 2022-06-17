#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const {getSpawnPromise, showError} = require('@s-ui/helpers/cli')
const {rmSync} = require('fs')

const {checkIsMonoPackage, getWorkspaces} = require('../src/config.js')

program
  .option(
    '--ci',
    'Optimized mode for CI. Avoid removing folders, showing progress, auditing, write package-lock files (if not npm ci) and more'
  )
  .option('--clean', 'Remove dependencies and package-lock for all packages')
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
    '--strict-peer-deps',
    'Install peer dependencies using the modern strict peer dependency install'
  )
  .option(
    '--use-package-lock',
    'Use package-lock.json to install packages and use npm ci on CI respecting package-lock file.'
  )
  .on('--help', () => {
    console.log(`
  Description:
    Install monorepo dependencies and execute needed scripts for each package.

  Examples:
    $ sui-mono install`)
  })
  .parse(process.argv)

const {
  audit = false,
  clean = true,
  ci = Boolean(process.env.CI),
  progress = true,
  production = false,
  root = true,
  strictPeerDeps = false,
  usePackageLock = false
} = program.opts()

const NPM_BIN = 'npm'
const NPM_CMD_ARGS = [
  usePackageLock && ci ? 'ci' : 'install',
  '--loglevel=error',
  '--no-fund',
  audit ? '' : '--no-audit',
  production ? '--production' : '--production=false',
  progress ? '' : '--no-progress',
  strictPeerDeps ? '' : '--legacy-peer-deps',
  usePackageLock ? '' : '--no-package-lock'
]
const CI_FLAGS = [
  '--no-audit',
  '--no-progress',
  '--no-save',
  '--prefer-offline'
]

const avoidCleanDependencies = ci || !clean || !root

console.log(`[sui-mono] Installing packages...`)
console.info(`\t Optimized CI mode enabled: ${ci}`)
console.info(
  `\t Will it remove node_modules and package-lock?: ${
    avoidCleanDependencies ? 'no' : 'yes'
  }`
)
console.info(
  `\t Will it install devDependencies?: ${production ? 'no' : 'yes'}`
)

/** Remove dependencies and package-lock
 *  @param {string} cwd - current working directory
 */
const removeDependencies = cmd => {
  try {
    rmSync(`${cmd}/node_modules`, {force: true, recursive: true})
    rmSync(`${cmd}/package-lock.json`, {force: true, recursive: true})
  } catch {}
}

/**
 * Create needed commands to install packages
 * @param {string} cwd
 */
const createInstallPackagesCommand = (cwd = process.cwd()) => {
  const executionParams = {cwd}
  const npmCommandArgs = ci
    ? [...new Set([...NPM_CMD_ARGS, ...CI_FLAGS])] // use Set to remove duplicates
    : NPM_CMD_ARGS

  return [NPM_BIN, npmCommandArgs, executionParams]
}

/**
 * Install packages
 * @return {Promise}
 */
const installPackages = async () => {
  if (!root) return Promise.resolve()

  console.log(`[sui-mono] Installing packages...`)
  const [installBin, installArgs, installExecutionParams] =
    createInstallPackagesCommand()
  await getSpawnPromise(installBin, installArgs, installExecutionParams)

  console.log('[sui-mono] Installed packages')
}

const executePackagesScripts = async () => {
  console.log(`[sui-mono] Executing script packages...`)
  await getSpawnPromise('npx', [
    '-y',
    'ultra-runner@3.10.5',
    '--raw',
    '--recursive',
    'prepublishOnly',
    '&>/dev/null'
  ])
  console.log('[sui-mono] Executed all script packages')
}

const removeDependenciesForPackages = () => {
  if (avoidCleanDependencies) return Promise.resolve()

  console.log(`[sui-mono] Removing previous root packages...`)
  removeDependencies(process.cwd())

  if (checkIsMonoPackage()) return

  console.log(`[sui-mono] Removing previous packages...`)
  // if we're on CI, we don't need to remove folders
  const removeFoldersPromise = ci
    ? Promise.resolve()
    : Promise.all(getWorkspaces().map(removeDependencies))

  return removeFoldersPromise
}

removeDependenciesForPackages()
  .then(installPackages)
  .then(executePackagesScripts)
  .then(() => process.exit(0))
  .catch(showError)

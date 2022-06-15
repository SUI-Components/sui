#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const {getSpawnPromise, showError} = require('@s-ui/helpers/cli')
const {rmSync} = require('fs')

const {checkIsMonoPackage, getWorkspaces} = require('../src/config.js')

const CI_FLAGS = [
  'loglevel=error',
  'no-audit',
  'no-fund',
  'no-package-lock',
  'no-progress',
  'no-save',
  'no-shrinkwrap',
  'prefer-offline'
].map(flag => `--${flag}`)

program
  .option(
    '--ci',
    'Optimized mode for CI. Avoid removing folders, showing progress, auditing, write package-lock files and more'
  )
  .option(
    '--strict-peer-deps',
    'Install peer dependencies using the modern strict peer dependency install'
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
  .on('--help', () => {
    console.log(`
  Description:
    Install monorepo dependencies and execute needed scripts for each package.

  Examples:
    $ sui-mono install`)
  })
  .parse(process.argv)

const {
  audit = true,
  ci = Boolean(process.env.CI),
  progress = true,
  production = false,
  root = true,
  strictPeerDeps = false
} = program.opts()

const NPM_BIN = 'npm'
const NPM_CMD = [
  NPM_BIN,
  [
    'install',
    '--loglevel=error',
    '--no-fund',
    audit ? '' : '--no-audit',
    production ? '--production' : '',
    progress ? '' : '--no-progress',
    strictPeerDeps ? '' : '--legacy-peer-deps'
  ]
]

console.log(`[sui-mono] Clean installing packages`)
console.info(`[sui-mono] CI mode enabled: ${ci}`)

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
  console.log(['[sui-mono] Executed all script packages'])
}

const removeDependenciesForPackages = () => {
  if (!root) return Promise.resolve()

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

#!/usr/bin/env node

// @ts-check

import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'fs'
import {chmod, writeFile} from 'fs/promises'
import {join} from 'path'

import get from 'dlv'
import {dset as set} from 'dset'

/** In order to ensure this could work on postinstall script and also manually
 * we neet to check if INIT_CWD is available and use it instead cwd
 * as on postinstall the cwd will change
 */
const {CI = false, INIT_CWD} = process.env
const cwd = INIT_CWD || process.cwd()
const pkgPath = join(cwd, 'package.json')

const {name} = readPackageJson()
/** We avoid performing the precommit install:
 **  - for CI and the same precommit package
 **  - for the `@s-ui/precommit` pkg itself */

/**
 * Get the actual git directory path, handling both normal repos and worktrees.
 * In a worktree, .git is a file containing a reference to the actual git directory.
 * @param {string} gitPath - Path to the .git file or directory
 * @returns {string} Path to the actual git directory
 */
function getGitDirectory(gitPath) {
  const gitStat = statSync(gitPath)

  if (gitStat.isDirectory()) {
    // Normal git repository
    return gitPath
  } else if (gitStat.isFile()) {
    // Git worktree - read and parse the gitdir reference
    const gitFileContent = readFileSync(gitPath, {encoding: 'utf8'}).trim()

    // Expected format: "gitdir: /path/to/actual/.git/worktrees/name"
    const match = gitFileContent.match(/^gitdir:\s*(.+)$/)

    if (!match) {
      throw new Error(`Invalid .git file format: ${gitFileContent}`)
    }

    const gitDir = match[1].trim()

    // Validate the referenced directory exists
    if (!existsSync(gitDir)) {
      throw new Error(`Git directory referenced in .git file does not exist: ${gitDir}`)
    }

    return gitDir
  } else {
    throw new Error('.git exists but is neither a file nor a directory')
  }
}

if (CI === false && name !== '@s-ui/precommit') {
  const gitPath = join(cwd, '.git')

  /**
   * Check if .git exists. If not, it means
   * the project is not a Git Repository and it doesn't
   * make sense to install Git hooks for now.
   */
  if (!existsSync(gitPath)) {
    log('No .git folder found. Skipping precommit hooks installation...')
    process.exit(0)
  }

  try {
    // Get the actual git directory (handles both normal repos and worktrees)
    const gitDirectory = getGitDirectory(gitPath)
    const hooksPath = join(gitDirectory, 'hooks')

    // Ensure hooks directory exists (important for worktrees)
    if (!existsSync(hooksPath)) {
      mkdirSync(hooksPath, {recursive: true})
      log('Created hooks directory...')
    }

    log('Installing precommit hooks...')

    const commitMsgPath = join(hooksPath, 'commit-msg')
    const preCommitPath = join(hooksPath, 'pre-commit')
    const prePushPath = join(hooksPath, 'pre-push')

    await Promise.all([
      writeFile(commitMsgPath, '#!/bin/sh\nnpm run commit-msg --if-present'),
      writeFile(preCommitPath, '#!/bin/sh\nnpm run pre-commit --if-present'),
      writeFile(prePushPath, '#!/bin/sh\nnpm run pre-push --if-present')
    ])

    await Promise.all([chmod(commitMsgPath, '755'), chmod(preCommitPath, '755'), chmod(prePushPath, '755')])

    // Add package.json modifications
    addToPackageJson('sui-lint js --staged && sui-lint sass --staged', 'scripts.lint', false)
    addToPackageJson('echo "Skipping tests as they are not present"', 'scripts.test', false)
    addToPackageJson('npm run lint', 'scripts.pre-commit', false)
    addToPackageJson('npm run test', 'scripts.pre-push', false)
    removeFromPackageJson('husky')
  } catch (err) {
    log(err.message)
    log('[@s-ui/precommit] Installation has FAILED.')
    process.exit(1)
  }
}

function log(...args) {
  /* eslint-disable no-console */
  args[0] = '[@s-ui/precommit] ' + args[0]
  console.log(...args)
}

/**
 * Read package.json file
 * @returns {object} Package.json content in JSON format
 */
function readPackageJson() {
  return JSON.parse(readFileSync(pkgPath, {encoding: 'utf8'}))
}

/**
 * Add script on package.json where command was executed
 * @param  {string}   script command to execute
 * @param  {string?}  path  path where the script must be added. Could be composed.
 * @param  {boolean}  overwrite the path script if already exists
 **/
function addToPackageJson(script, path, overwrite = true) {
  const pkg = readPackageJson()
  // write if the path doesn't exist or we have to overwrite it
  if (get(pkg, path) === undefined || overwrite) {
    set(pkg, path, script)
    log(`Added "${path}"...`)
    writePackageJson(pkg)
  }
}

/**
 * Add script on package.json where command was executed
 * @param  {string}  name   property to remove
 **/
function removeFromPackageJson(name) {
  const pkg = readPackageJson()
  const {[name]: remove, ...rest} = pkg
  log(`"${name}" removed from package. Writing changes...`)
  writePackageJson(rest)
}

/**
 * Write package.json file where command was executed
 * @param {object} pkg New package content to be write on the file
 */
function writePackageJson(pkg) {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: 'utf8'})
}

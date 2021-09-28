#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')
const set = require('dset')
const get = require('dlv')
const {writeFile} = require('@s-ui/helpers/file')

/** In order to ensure this could work on postinstall script and also manually
 * we neet to check if INIT_CWD is available and use it instead cwd
 * as on postinstall the cwd will change
 */
const {CI = false, INIT_CWD} = process.env
const cwd = INIT_CWD || process.cwd()
const pkgPath = path.join(cwd, 'package.json')

const {name} = readPackageJson()
/** We avoid performing the precommit install:
 **  - for CI and the same precommit package
 **  - for the `@s-ui/precommit` pkg itself */

if (CI === false && name !== '@s-ui/precommit') {
  const hooksPath = path.join(cwd, '.git')

  const commitMsgPath = `${hooksPath}/hooks/commitmsg`
  const preCommitPath = `${hooksPath}/hooks/pre-commit`
  const prePushPath = `${hooksPath}/hooks/pre-push`

  Promise.all([
    writeFile(commitMsgPath, '#!/bin/sh\nnpm run commitmsg --if-present'),
    writeFile(preCommitPath, '#!/bin/sh\nnpm run pre-commit --if-present'),
    writeFile(prePushPath, '#!/bin/sh\nnpm run pre-push --if-present')
  ]).then(() =>
    Promise.all([
      fsPromises.chmod(commitMsgPath, '755'),
      fsPromises.chmod(preCommitPath, '755'),
      fsPromises.chmod(prePushPath, '755')
    ])
  )

  try {
    addToPackageJson(
      'sui-lint js --staged && sui-lint sass --staged',
      'scripts.lint',
      false
    )
    addToPackageJson('echo "Add test script"', 'scripts.test', false)
    addToPackageJson('npm run lint', 'scripts.pre-commit', false)
    addToPackageJson('npm run test', 'scripts.pre-push', false)
    removeFromPackageJson('husky')
  } catch (err) {
    log(err.message)
    log('sui-precommit installation has FAILED.')
    process.exit(1)
  }
}

function log(...args) {
  /* eslint-disable no-console */
  args[0] = '[sui-precommit] ' + args[0]
  console.log(...args)
}

/**
 * Read package.json file
 * @returns {object} Package.json content in JSON format
 */
function readPackageJson() {
  console.log(pkgPath)
  return require(pkgPath)
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
    log(`Writing "${name}" on object path "${path}"...`)
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
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: 'utf8'})
}

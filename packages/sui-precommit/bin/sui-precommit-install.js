#!/usr/bin/env node

const {spawn} = require('child_process')
const Validate = require('git-validate')

installHuskyIfNotInstalled()
  .then(function () {
    installScript('lint', 'sui-lint js && sui-lint sass')
    installScript('precommit', 'sui-precommit run')
  })
  .catch(function () {
    log('sui-precommit could not be properly installed')
    process.exit(1)
  })

/* eslint-disable no-console */
function log (...args) {
  args[0] = '[sui-precommit] ' + args[0]
  console.log(...args)
}

/**
 * Installs script on package.json where command was executed
 * @param  {String} key   script name
 * @param  {String} value command to execute
 */
function installScript (key, value) {
  log('Installing "' + value + '" npm script on "' + key + '".')
  Validate.installScript(key, value, { overwrite: 1 }, process.cwd())
}

/**
 * Installs husky on project
 * @return {Promise}
 */
function installHuskyIfNotInstalled () {
  return new Promise(function (resolve, reject) {
    if (!isHuskyInstalled()) {
      log('husky will be installed as git hook integration with node')
      spawn('npm', ['install', 'husky@0.13.4', '--save-dev'], { shell: true, stdio: 'inherit' })
        .on('exit', code => { !code ? resolve(code) : reject(code) })
    } else {
      resolve(0)
    }
  })
}

/**
 * Get if husky is already installed
 * @return {Boolean}
 */
function isHuskyInstalled () {
  try {
    require.resolve('husky')
    return true
  } catch (e) {
    return false
  }
}

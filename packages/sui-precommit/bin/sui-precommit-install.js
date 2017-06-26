#!/usr/bin/env node

const {spawn} = require('child_process')
const path = require('path')
const fs = require('fs')

installHuskyIfNotInstalled()
  .then(function () {
    installScript('lint', 'sui-lint js && sui-lint sass')
    installScript('precommit', 'sui-precommit run')
  })
  .catch(function (err) {
    log(err.message)
    log('sui-precommit installation has FAILED.')
    process.exit(1)
  })

function log (...args) {
  /* eslint-disable no-console */
  args[0] = '[sui-precommit] ' + args[0]
  console.log(...args)
}

/**
 * Install script on package.json where command was executed
 * @param  {String} name   script name
 * @param  {String} script command to execute
 */
function installScript (name, script) {
  const pkgPath = path.join(process.cwd(), 'package.json');
  let pkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf8' }));
  pkg.scripts = pkg.scripts || {}
  pkg.scripts[name] && log('Script "' + name + '" already set. Overwritting...')
  pkg.scripts[name] = script
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), { encoding: 'utf8' })
}

/**
 * Install husky on project
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

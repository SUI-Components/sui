#!/usr/bin/env node

const {getSpawnPromise} = require('@s-ui/helpers/cli')
const path = require('path')
const fs = require('fs')
const pkgPath = path.join(process.cwd(), 'package.json')

installHuskyIfNotInstalled()
  .then(function() {
    installScript('lint', 'sui-lint js && sui-lint sass')
    installScript('precommit', 'sui-precommit run')
  })
  .catch(function(err) {
    log(err.message)
    log('sui-precommit installation has FAILED.')
    process.exit(1)
  })

function log(...args) {
  /* eslint-disable no-console */
  args[0] = '[sui-precommit] ' + args[0]
  console.log(...args)
}

/**
 * Install script on package.json where command was executed
 * @param  {String} name   script name
 * @param  {String} script command to execute
 */
function installScript(name, script) {
  let pkg = JSON.parse(fs.readFileSync(pkgPath, {encoding: 'utf8'}))
  pkg.scripts = pkg.scripts || {}
  pkg.scripts[name] && log('Script "' + name + '" already set. Overwritting...')
  pkg.scripts[name] = script
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: 'utf8'})
}

/**
 * Install husky on project
 * @return {Promise}
 */
function installHuskyIfNotInstalled() {
  if (!isHuskyInstalled()) {
    log('husky will be installed to allow git hook integration with node')
    return getSpawnPromise('npm', [
      'install',
      'husky@0.13.4',
      '--save-dev',
      '--save-exact'
    ])
  } else {
    return Promise.resolve(0)
  }
}

/**
 * Get if husky is already installed
 * @return {Boolean}
 */
function isHuskyInstalled() {
  let pkg = JSON.parse(fs.readFileSync(pkgPath, {encoding: 'utf8'}))
  return pkg.devDependencies && pkg.devDependencies['husky']
}

#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const path = require('path')
const { exec } = require('child_process')
const config = require('../src/config')
const { getSpawnPromise, showError } = require('@s-ui/helpers/cli')

program
  .usage('-m "My commit message"')
  .option('-m, --message "<message>"', 'Commit message')
  .option('-t, --type "<commit-type>"', 'Commit type')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Do same commit for all packages')
    console.log('')
    console.log('    Usefull for cross-pacakge refactors.')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono commit-all --type=fix -m "bump dependency to major version"')
    console.log('    $ sui-mono --help')
    console.log('    $ sui-mono -h')
    console.log('')
  })
  .parse(process.argv)

// Check mandatory parameters
const {message, type} = program
!message && showError('Commit message is mandatory')
!type && showError('Commit type is mandatory')

const packagesDir = path.join(process.cwd(), config.getPackagesFolder())

/**
 * Checks if given path has changes
 * @param  {String}  path Folder to check
 * @return {Promise<Boolean>}
 */
const hasChangedFiles = (path) => {
  return new Promise((resolve, reject) => {
    exec(`git add . && git status ${path}`, {cwd: path}, (err, output) => {
      err ? reject(err) : resolve(!output.includes('nothing to commit'))
    })
  })
}

/**
 * Checks the number of commits apply precommit hooks only on first commit
 * @type {Number}
 */
let commitsCount = 0

/**
 * Functions that executes the commit for each package
 * @type {Array<Function>}
 */
const checkStageFuncs = config.getScopes().map((pkg) => {
  const pkgPath = path.join(packagesDir, pkg)
  return () => hasChangedFiles(pkgPath)
    .then(hasChanges => {
      if (hasChanges) {
        let args = ['commit', `-m "${type}(${pkg}): ${message}"`]
        commitsCount++ && args.push('--no-verify') // precommit only once
        return getSpawnPromise('git', args)
      }
    })
})

getSpawnPromise('git', ['reset']) // Unstage all prossible staged files
  .then(() => checkStageFuncs
    .reduce((promise, func) => promise.then(func), Promise.resolve())
  )
  .catch(showError)

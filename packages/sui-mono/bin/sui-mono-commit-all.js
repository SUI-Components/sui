#!/usr/bin/env node
/* eslint no-console:0 */
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const program = require('commander')
const {getSpawnPromise, showError} = require('@s-ui/helpers/cli')
const {getWorkspaces} = require('../src/config.js')

program
  .usage('-m "My commit message"')
  .option('-m, --message "<message>"', 'Commit message')
  .option('-t, --type "<commit-type>"', 'Commit type')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Do same commit for all packages')
    console.log('')
    console.log('    Useful for cross-pacakge refactors.')
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
const {message, type} = program.opts()

!message && showError('Commit message is mandatory')
!type && showError('Commit type is mandatory')

/**
 * Checks if given path has changes and `git add` them
 * @param  {String}  path Folder to check
 * @return {Promise<Boolean>}
 */
const hasChangedFiles = async path => {
  let stdout = ''

  try {
    await exec(`git add .`, {cwd: path})
    const status = await exec(`git status ${path} --porcelain`)
    stdout = status.stdout || ''
  } catch (error) {
    console.error(error)
  }

  return stdout.trim() !== ''
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
const checkStageFuncs = getWorkspaces().map(pkg => {
  return () =>
    hasChangedFiles(pkg).then(hasChanges => {
      if (hasChanges) {
        const packageName = pkg === '.' ? 'Root' : pkg
        const args = ['commit', `-m "${type}(${packageName}): ${message}"`]
        commitsCount++ && args.push('--no-verify') // precommit only once
        return getSpawnPromise('git', args)
      }
    })
})

getSpawnPromise('git', ['reset']) // Unstage all prossible staged files
  .then(() => checkStageFuncs.reduce((promise, func) => promise.then(func), Promise.resolve()))
  .catch(showError)

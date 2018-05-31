/* eslint no-console:0 */
const program = require('commander')
const fs = require('fs')
const path = require('path')
const conventionalChangelog = require('conventional-changelog')
const {getScopes, getPackagesFolder, isMonoPackage} = require('../src/config')
const {getPackagesPaths} = require('@s-ui/helpers/packages')

program
  .usage('<folder1> <folder2> <etc>')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Generates a CHANGELOG.md of the given folders.')
    console.log(
      '    If no folder is specified, CHANGELOG.md will be generated for all packages.'
    )
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono changelog ./packages/sui-bundler')
    console.log('    $ sui-mono changelog')
    console.log('')
  })
  .parse(process.argv)

const CHANGELOG_NAME = 'CHANGELOG.md'
const cwd = path.join(process.cwd(), getPackagesFolder())
const getRepoFolders = () =>
  !isMonoPackage() ? getPackagesPaths(cwd)(getScopes()) : ['.']
const folders = program.args.length ? program.args : getRepoFolders()
const changelogOptions = {
  preset: 'angular',
  append: false,
  releaseCount: 0,
  outputUnreleased: false,
  transform: function(commit, cb) {
    if (commit.type === 'release') {
      // Identifies commits that set a version as tags are not set
      commit.version = commit.subject.replace('v', '')
    }
    if (!isMonoPackage()) {
      // Remove repeated scope for multipackage
      commit.scope = ''
    }
    commit.committerDate = commit.committerDate.substring(0, 10) // simple date format
    cb(null, commit)
  }
}

/**
 * Generate CHANGELOG.md file for all commits of given folder
 * @param  {String} folder Path of the folder
 * @return {Promise<String>} Promise resolve with path of generated file
 */
function generateChangelog(folder) {
  folder = path.resolve(folder)
  return new Promise((resolve, reject) => {
    let gitRawCommitsOpts = {path: folder}
    let outputFile = path.join(folder, CHANGELOG_NAME)
    let output = fs.createWriteStream(path.join(outputFile))
    let chunkCount = 0
    return conventionalChangelog(changelogOptions, {}, gitRawCommitsOpts)
      .on('data', chunk => {
        if (!chunkCount++) {
          // First chunk is always an empty release
          output.write(
            '# Change Log\n\n' +
              'All notable changes to this project will be documented in this file.\n\n'
          )
        }
        output.write(chunk)
      })
      .on('end', () => resolve(outputFile))
      .on('error', reject)
  })
}

Promise.all(folders.map(path => generateChangelog(path)))
  .then(code => process.exit(0))
  .catch(code => process.exit(1))

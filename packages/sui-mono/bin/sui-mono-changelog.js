/* eslint no-console:0 */
const program = require('commander')
const fs = require('fs')
const path = require('path')

const conventionalChangelog = require('../src/conventional-changelog.js')
const {checkIsMonoPackage, getWorkspaces, getChangelogFilename} = require('../src/config.js')
const {fetchTags} = require('../src/tags.js')

program
  .usage('<folder1> <folder2> <etc>')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Generates a CHANGELOG.md of the given folders.')
    console.log('    If no folder is specified, CHANGELOG.md will be generated for all packages.')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-mono changelog ./packages/sui-bundler')
    console.log('    $ sui-mono changelog')
    console.log('')
  })
  .parse(process.argv)

const CHANGELOG_NAME = getChangelogFilename()

const folders = program.args.length ? program.args : getWorkspaces()

const changelogOptions = {
  preset: 'angular',
  append: false,
  releaseCount: 1,
  outputUnreleased: false,
  transform: (commit, cb) => {
    if (commit.type === 'release') {
      // Identifies commits that set a version as tags are not set
      commit.version = commit.subject.replace('v', '').replace(' [skip ci]', '')
    }

    if (!checkIsMonoPackage()) {
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
    const gitRawCommitsOpts = {path: folder}
    const outputFile = path.join(folder, CHANGELOG_NAME)
    const title = '# CHANGELOG'
    const content = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf8') : ''
    const output = fs.createWriteStream(outputFile)

    const name = getWorkspaces().find(path => folder.endsWith(path))
    const promise = name ? fetchTags(name) : Promise.resolve()

    let chunkCount = 0

    return promise.then(tags => {
      return conventionalChangelog({...changelogOptions, gitSemverTags: tags}, {}, gitRawCommitsOpts)
        .on('data', chunk => {
          if (!chunkCount++) output.write(`${title}\n\n`)
          output.write(chunk)
        })
        .on('end', () => {
          output.write(chunkCount > 0 && content ? content.replace(title, '').trim() : content)
          output.end(() => resolve(outputFile))
        })
        .on('error', error => {
          output.destroy(error)
          reject(error)
        })
    })
  })
}

Promise.all(folders.map(path => generateChangelog(path)))
  .then(() => process.exit(0))
  .catch(() => process.exit(1))

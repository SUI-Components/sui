/* eslint-disable no-console */

const GIT_IGNORE_PATH = `${process.cwd()}/.gitignore`
const OPTIONS = {
  staged: '--staged',
  addFixes: '--add-fixes'
}
const optionFlags = Object.values(OPTIONS)

/**
 * Get args removing given args
 * @param {Array<String>} args process.argv
 * @returns {Array<String>}
 */
const filterOptionFlags = args => args.filter(arg => !optionFlags.includes(arg))

/**
 * Execute bin as lint command. If -c is defined, process will be exited.
 * @param  {String} binPath Absolute path of binary
 * @param  {Array} args    Arguments to pass to child process
 * @return {ChildProcess}
 */
function executeLintingCommand(binPath, args) {
  const {showError, getSpawnPromise} = require('@s-ui/helpers/cli')
  const [, , ...processArgs] = filterOptionFlags(process.argv)

  if (processArgs.find(arg => arg === '-c')) {
    console.log('[sui-lint] Dont use your own config file. Remove `-c` flag')
    process.exit(1)
  }
  return getSpawnPromise(binPath, args.concat(processArgs)).catch(showError)
}

/**
 * Get lines of a text file as an array of strings
 * @param {String} path
 * @returns {Array<String>}
 */
const getFileLinesAsArray = path => {
  const {existsSync, readFileSync} = require('fs')
  return existsSync(path)
    ? readFileSync(path, 'utf8')
        .toString()
        .split('\n')
        .filter(Boolean)
    : []
}

/**
 * Get as array .gitignore files and filter lines that are comments
 * @returns {Array<String>}
 */
const getGitIgnoredFiles = () =>
  getFileLinesAsArray(GIT_IGNORE_PATH).filter(line => !line.startsWith('#'))

/**
 * Get multiple value arg
 * @param {String} arg Ex: '--my-option'
 * @param {Array<String>} values
 * @returns {Array<String>} ['--ignore-pattern', 'folder/', ...]
 */
const getArrayArgs = (arg, values) => {
  return values.filter(Boolean).map(pattern => `${arg} ${pattern}`)
}

/**
 * Get from git status name of staged files
 * @param {Array<String>} extensions Extensions list: ['js', 'sass', 'css']
 * @returns {Promise<Array>} Array of file paths
 */
const getGitStatusFiles = async extensions => {
  const {extname} = require('path')
  return new Promise((resolve, reject) => {
    require('simple-git')().diff(
      ['--cached', '--name-only', '--diff-filter=d'], // Delete files as excluded
      function(err, summary) {
        err && reject(err)
        const files = summary
          ? summary
              .split('\n')
              .filter(file => extensions.includes(extname(file).substr(1)))
          : []
        resolve(files)
      }
    )
  })
}

/**
 * Get files to lint according to command options
 * @param {Array<String>} extensions Extensions list: ['js', 'sass', 'css']
 * @param {String} defaultFiles Defaults to './'
 * @returns {Promise<Array>} Array of file patterns
 */
const getFilesToLint = async (extensions, defaultFiles = './') =>
  process.argv.includes(OPTIONS.staged)
    ? getGitStatusFiles(extensions)
    : [defaultFiles]

/**
 * If --staged option is on, it will staged made changes
 * @param {Array<String>} extensions Extensions list: ['js', 'sass', 'css']
 * @returns {Promise}
 */
const stageFilesIfRequired = async extensions => {
  const {argv} = process
  if (argv.includes(OPTIONS.staged) && argv.includes(OPTIONS.addFixes)) {
    const {getSpawnPromise} = require('@s-ui/helpers/cli')
    const files = await getGitStatusFiles(extensions)
    return getSpawnPromise('git', ['add', ...files])
  }
}

/**
 * Get if current process has option set
 * @param {String} option
 */
const isOptionSet = option => process.argv.includes(option)

exports.executeLintingCommand = executeLintingCommand
exports.getFileLinesAsArray = getFileLinesAsArray
exports.getArrayArgs = getArrayArgs
exports.getFilesToLint = getFilesToLint
exports.getGitIgnoredFiles = getGitIgnoredFiles
exports.stageFilesIfRequired = stageFilesIfRequired
exports.isOptionSet = isOptionSet
exports.GIT_IGNORE_PATH = GIT_IGNORE_PATH
exports.OPTIONS = OPTIONS

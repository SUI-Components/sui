/* eslint-disable no-console */
const {existsSync, readFileSync} = require('fs')
const {extname} = require('path')
const {getSpawnPromise} = require('@s-ui/helpers/cli')
const {promisify} = require('util')
const exec = promisify(require('child_process').exec)

const GIT_IGNORE_PATH = `${process.cwd()}/.gitignore`
const OPTIONS = {
  staged: '--staged',
  addFixes: '--add-fixes',
  pattern: '--pattern'
}

/**
 * Get lines of a text file as an array of strings
 * @param {String} path
 * @returns {Array<String>}
 */
const getFileLinesAsArray = path =>
  existsSync(path)
    ? readFileSync(path, 'utf8')
        .split('\n')
        .filter(Boolean)
    : []

/**
 * Get as array .gitignore files and filter lines that are comments
 * @returns {Array<String>}
 */
const getGitIgnoredFiles = () =>
  getFileLinesAsArray(GIT_IGNORE_PATH).filter(line => !line.startsWith('#'))

/**
 * Get from git status name of staged files
 * @param {string[]} extensions Extensions list. Example: ['js', 'sass', 'css']
 * @returns {Promise<string[]>} Array of file paths
 */
const getGitDiffFiles = async ({extensions, range = null, staged = true}) => {
  const command = [
    'git diff --name-only --diff-filter=d',
    range && `${range}`,
    staged && '--cached'
  ]
    .filter(Boolean)
    .join(' ')

  return exec(command).then(({stdout: summary = ''}) =>
    getFilesFromDiff({summary, extensions})
  )
}

/**
 * Filter files from git diff status stdout
 * @param {string[]} extensions Extensions list. Example: ['js', 'sass', 'css']
 * @param {string} summary stdout from git diff
 * @returns {string[]} Array of file paths
 */
const getFilesFromDiff = ({extensions, summary}) =>
  summary
    .split('\n')
    .filter(file => extensions.includes(extname(file).substring(1)))

/**
 * Get files to lint according to command options
 * @param {string[]} extensions Extensions list: ['js', 'sass', 'css']
 * @param {string} defaultFiles Defaults to './'
 * @returns {Promise<string[]>} Array of file patterns
 */
const getFilesToLint = async (extensions, defaultFiles = './') => {
  const {TRAVIS_COMMIT_RANGE: range} = process.env
  const staged = process.argv.includes(OPTIONS.staged)
  const getFromDiff = range || staged

  return getFromDiff
    ? getGitDiffFiles({extensions, range, staged})
    : [defaultFiles]
}

/**
 * If --staged option is on, it will staged made changes
 * @param {Array<String>} extensions Extensions list: ['js', 'sass', 'css']
 * @returns {Promise}
 */
const stageFilesIfRequired = async extensions => {
  const {argv} = process
  const staged = argv.includes(OPTIONS.staged)
  const addFixes = argv.includes(OPTIONS.addFixes)

  if (staged && addFixes) {
    const files = await getGitDiffFiles({extensions, staged})
    return getSpawnPromise('git', ['add', ...files])
  }
}

/**
 * Get if current process has option set
 * @param {String} option
 */
const isOptionSet = option => process.argv.includes(`--${option}`)

exports.getFileLinesAsArray = getFileLinesAsArray
exports.getFilesToLint = getFilesToLint
exports.getGitIgnoredFiles = getGitIgnoredFiles
exports.stageFilesIfRequired = stageFilesIfRequired
exports.isOptionSet = isOptionSet
exports.GIT_IGNORE_PATH = GIT_IGNORE_PATH
exports.OPTIONS = OPTIONS

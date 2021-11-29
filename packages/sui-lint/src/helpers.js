// @ts-check
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
 * @param {object} params
 * @param {string[]} params.extensions Extensions list. Example: ['js', 'sass', 'css']
 * @param {string=} params.range Range of commits to lint
 * @param {boolean} params.staged If true, it will get staged files
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
 * @param {object} params
 * @param {string[]} params.extensions Extensions list. Example: ['js', 'sass', 'css']
 * @param {string} params.summary stdout from git diff
 * @returns {string[]} Array of file paths
 */
const getFilesFromDiff = ({extensions, summary}) =>
  summary
    .split('\n')
    .filter(file => extensions.includes(extname(file).substring(1)))

/**
 * Get the commit range depending on the CI used (Travis or GitHub Actions)
 * @returns {string|null} - Example: commit1...commit2
 */
const getCommitRange = () => {
  const {GITHUB_EVENT_PATH, TRAVIS_COMMIT_RANGE: travisRange} = process.env
  // Travis has a built-in environment variable that
  // always returns the commit range that we need
  if (travisRange) return travisRange

  if (GITHUB_EVENT_PATH) {
    const file = readFileSync(GITHUB_EVENT_PATH, 'utf8')
    const {after, before, pull_request: pullRequest} = JSON.parse(file)
    // get the correct commit range depending if
    // we're on a PR or a push to master
    const base = pullRequest?.base?.sha ?? before
    const head = pullRequest?.head?.sha ?? after

    if (after && before) return `${base}...${head}`
  }

  return null
}

/**
 * Get files to lint according to command options
 * @param {string[]} extensions Extensions list: ['js', 'sass', 'css']
 * @param {string} defaultFiles Defaults to './'
 * @returns {Promise<string[]>} Array of file patterns
 */
const getFilesToLint = async (extensions, defaultFiles = './') => {
  const range = getCommitRange()
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

/**
 * Check if there're files to lint and output a message
 * @param {Object} params
 * @param {String[]} params.files Files to lint
 * @param {"JavaScript" | "SCSS"} params.language Language to lint
 * @returns {boolean} If there's files to lint
 */
const checkFilesToLint = ({files, language}) => {
  if (!files.length) {
    console.log(`[sui-lint] No ${language} files to lint`)
    return false
  }

  console.log(`[sui-lint] Linting ${files.length} ${language} files...`)
  return true
}

exports.checkFilesToLint = checkFilesToLint
exports.getFileLinesAsArray = getFileLinesAsArray
exports.getFilesToLint = getFilesToLint
exports.getGitIgnoredFiles = getGitIgnoredFiles
exports.isOptionSet = isOptionSet
exports.stageFilesIfRequired = stageFilesIfRequired
exports.GIT_IGNORE_PATH = GIT_IGNORE_PATH
exports.OPTIONS = OPTIONS

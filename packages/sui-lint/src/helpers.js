/* eslint-disable no-console */

/**
 * Execute bin as lint command. If -c is defined, process will be exited.
 * @param  {String} binPath Absolute path of binary
 * @param  {Array} args    Arguments to pass to child process
 * @return {ChildProcess}
 */
function executeLintingCommand (binPath, args) {
  const { spawn } = require('child_process')
  const [, , ...processArgs] = process.argv

  if (processArgs.find(arg => arg === '-c')) {
    console.log('[sui-lint] Dont use your own config file. Remove `-c` flag')
    process.exit(1)
  }

  return spawn(binPath, args.concat(processArgs), {
    shell: true,
    stdio: 'inherit'
  }).on('exit', code => process.exit(code))
}

/**
 * Get lines of a text file as an array of strings
 * @param {String} path
 * @returns {Array<String>}
 */
const getFileLinesAsArray = path => {
  const { existsSync, readFileSync } = require('fs')
  return existsSync(path)
    ? readFileSync(path, 'utf8')
      .toString()
      .split('\n')
      .filter(Boolean)
    : []
}

/**
 * Get eslint --ignore-pattern patterns options
 * @param {Array<String>} patterns
 * @returns {Array<String>} ['--ignore-pattern', 'folder/', ...]
 */
const getIgnorePatterns = patterns => {
  return patterns.filter(Boolean).map(pattern => `--ignore-pattern ${pattern}`)
}

exports.executeLintingCommand = executeLintingCommand
exports.getFileLinesAsArray = getFileLinesAsArray
exports.getIgnorePatterns = getIgnorePatterns


/**
 * Calls sui-mono comman with sui-studio default config
 * @param  {String} command Name of the command
 * @return {ChildProcess}
 */
function callSuiMonoCommand (command) {
  const BIN_PATH = require.resolve('@schibstedspain/sui-mono/bin/sui-mono')
  callCommand(BIN_PATH, [ command,
    ...getSuiMonoOptions()
  ])
}

/**
 * Parses sui-mono config in package.json and returns corresponding CLI options
 * @return {Array<String>} CLI options
 */
function getSuiMonoOptions () {
  const path = require('path')
  const pkg = require(path.join(__dirname, '..', '..', 'package.json'))
  const conf = pkg && pkg.config && pkg.config['sui-mono']
  if (conf) {
    return Object.keys(conf).map(key => '--' + key + '=' + conf[key])
  }
  return []
}

/**
 * Calls a binary with options to ensure consistent output and execution
 * @param  {String} binPath Absolute path of binary
 * @param  {Array<String>} args
 * @return {ChildProcess}
 */
function callCommand (binPath, args) {
  const {spawn} = require('child_process')
  return spawn(binPath, args, { shell: true, stdio: 'inherit' })
    .on('exit', code => { code && process.exit(code) })
}

module.exports = { callCommand, callSuiMonoCommand }

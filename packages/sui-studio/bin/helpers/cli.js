/**
 * Calls sui-mono comman with sui-studio default config
 * @param  {String} command Name of the command
 * @return {ChildProcess}
 */
function callSuiMonoCommand(command) {
  const BIN_PATH = require.resolve('@s-ui/mono/bin/sui-mono')
  const [, , ...args] = process.argv

  callCommand(BIN_PATH, [command, ...args])
}

/**
 * Calls a binary with options to ensure consistent output and execution
 * @param  {String} binPath Absolute path of binary
 * @param  {Array<String>} args
 * @return {ChildProcess}
 */
function callCommand(binPath, args) {
  const {spawn} = require('child_process')
  return spawn(binPath, args, {shell: true, stdio: 'inherit'}).on(
    'exit',
    code => {
      code && process.exit(code)
    }
  )
}

module.exports = {callCommand, callSuiMonoCommand}

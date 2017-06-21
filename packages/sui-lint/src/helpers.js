/* eslint-disable no-console */

/**
 * Execute bin as lint command. If -c is defined, process will be exited.
 * @param  {String} binPath Absolute path of binary
 * @param  {Array} args    Arguments to pass to child process
 * @return {ChildProcess}
 */
function executeLintingCommand (binPath, args) {
  const {spawn} = require('child_process')
  const [,, ...processArgs] = process.argv

  if (processArgs.find(arg => arg === '-c')) {
    console.log('[sui-lint] Dont use your own config file. Remove `-c` flag')
    process.exit(1)
  }

  return spawn(binPath, args.concat(processArgs), { shell: true, stdio: 'inherit' })
    .on('exit', code => process.exit(code))
}

exports.executeLintingCommand = executeLintingCommand

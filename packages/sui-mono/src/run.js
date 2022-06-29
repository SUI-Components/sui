const program = require('commander')
const config = require('../src/config.js')

/**
 * Get array of commands to execute on all folders
 * @return {Array<Array>}
 */
function getAllTaskArrays() {
  const cwds = config.getWorkspaces()
  return cwds.map(getTaskArray)
}

/**
 * Get array of command for given folder
 * @param  {String} folder
 * @return {Array<Array>}
 */
function getTaskArray(folder) {
  const [command] = program.args
  const args = process.argv.slice(process.argv.indexOf(command) + 1)
  return [command, args, {cwd: folder}]
}

module.exports = {getAllTaskArrays}

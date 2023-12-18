// @ts-check

'use strict'

const {execSync, execFileSync} = require('child_process')
const {cyan, gray, bold} = require('@s-ui/helpers/colors')

/** @type {import('child_process').ExecSyncOptionsWithStringEncoding} */
const execOptions = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore' // stderr
  ]
}

/**
 * Get the process id for a given port.
 * @param {number} port - The port to look for
 * @returns {string} The process id
 */
function getProcessIdOnPort(port) {
  return execFileSync('lsof', [`-i:${port}`, '-P', '-t', '-sTCP:LISTEN'], execOptions)
    .split('\n')[0]
    .trim()
}

/**
 * Get the command for a given process id.
 * @param {string} processId - The process id
 * @returns {string} - The process name
 */
function getProcessCommand(processId) {
  const command = execSync('ps -o command -p ' + processId + ' | sed -n 2p', execOptions)

  return command.replace(/\n$/, '')
}

/**
 * Get the directory of a process by its id.
 * @param {string} processId - The process id
 * @returns {string} - The process directory
 */
function getDirectoryOfProcessById(processId) {
  return execSync(`lsof -p ${processId} | awk '$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}'`, execOptions).trim()
}

/**
 * Get all the information about a process running in a port
 * @param {number} port - The port to look for
 * @returns {null |}
 */
function getProcessForPort(port) {
  try {
    const processId = getProcessIdOnPort(port)
    const directory = getDirectoryOfProcessById(processId)
    const command = getProcessCommand(processId)

    return bold(command) + gray(' (pid ' + processId + ')\n') + gray('  in ') + cyan(directory)
  } catch (e) {
    return null
  }
}

module.exports = getProcessForPort

/* eslint no-console:0 */
const colors = require('colors')
const program = require('commander')
const execa = require('execa')
const {default: Queue} = require('p-queue')
const path = require('path')
const logUpdate = require('./log-update.js')

const isWin = process.platform === 'win32'
const CODE_OK = 0
const CODE_KO = 1
const log = console.log

/**
 * Spawn several commands in children processes, in series
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function serialSpawn(commands, options = {}) {
  return commands.reduce(
    (promise, args) => promise.then(getSpawnPromiseFactory(...args, options)),
    Promise.resolve()
  )
}

/**
 * Spawn several commands in children processes, in parallel
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function parallelSpawn(commands, options = {}) {
  const {chunks, title} = options

  commands = commands.map(([bin, args, opts]) => [
    bin,
    args,
    {...opts, ...options}
  ])

  const commandsTitle = title || 'commands'

  log(`›› Running ${commands.length} ${commandsTitle} in parallel.`.cyan)
  return spawnList(commands, {chunks, title})
    .then(() => {
      logUpdate.done(
        `✔ ${commands.length} ${commandsTitle} run successfully.`.green
      )
      return CODE_OK
    })
    .catch(showError)
}

/**
 * Executes n commands as an updating list in the command line
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param {Object} options Options for the spawn list
 * @param {Number=} options.chunks Number of chunks of tasks to split by to avoid too long output
 * @param {string=} options.title Title to be used as command
 */
function spawnList(commands, {chunks = 15, title = ''} = {}) {
  const concurrency = Number(chunks)
  const queue = new Queue({concurrency})

  commands.map(([bin, args, opts, titleFromCommand]) =>
    queue
      .add(() => execa(...getArrangedCommand(bin, args, opts)))
      .then(() => {
        const titleToUse =
          title || titleFromCommand || getCommandCallMessage(bin, args, opts)
        const {size, pending} = queue
        const count = `${size + pending} of ${commands.length} pending`
        logUpdate(`› ${titleToUse} ─ ${count.cyan}`)
      })
  )

  return queue.onIdle()
}

/**
 * Get a function that returns a promise of given command
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Options to pass to child_process.spawn call
 * @return {Function} Function to execute to get the promise
 */
function getSpawnPromiseFactory(bin, args, options) {
  return () => getSpawnPromise(bin, args, options)
}

/**
 * Spawn given command and return a promise of the exit code value
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Options to pass to child_process.spawn call
 * @return {Promise<any>} Process exit code
 */
function getSpawnPromise(bin, args, options = {}) {
  if (options.stdio !== 'ignore') {
    log('')
    log(getCommandCallMessage(bin, args, options))
  }
  return execa(bin, args, options)
    .then(() => CODE_OK)
    .catch(() => CODE_KO)
}

/**
 * Returns modified command to work on linux, osx and windows.
 * The flag '#!/usr/bin/env node' is ignored by Windows. So the scripts must
 * be executed by node explicitely.
 * We assume that if `bin` is an abolsute path, it's always a js file to execute.
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} opts to pass to child_process.spawn call
 * @returns {Object} {bin, args, options}
 */
function getArrangedCommand(bin, args, opts) {
  return path.isAbsolute(bin) && isWin // check if it's a file or an alias
    ? ['node', [bin, ...args], opts]
    : [bin, args, opts]
}

/**
 * Get caption presenting comman execution in a folder
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options to pass to child_process.spawn call
 * @return {String}
 */
function getCommandCallMessage(bin, args, options = {}) {
  const folder = options.cwd
    ? options.cwd
        .split(path.sep)
        .slice(-2)
        .join(path.sep)
    : ''

  const command = bin.split(path.sep).pop() + ' ' + args.join(' ')
  return `${command.bold.white} ${folder.brightWhite}`
}

/**
 * Shows an error in the command line and exits process
 * It also outputs help content of the command
 * The program param will have commander instance to output the help command
 * @param  {String} msg
 * @param  {Object} foreignProgram
 */
const showError = (msg, foreignProgram = program) => {
  console.error(colors.red(`✖ Error: ${msg}\n`))
  foreignProgram.outputHelp(txt => txt)
  process.exit(1)
}

/**
 * Shows a visible warning message the command line.
 * @param {String} msg
 */
const showWarning = msg => {
  console.warn(colors.black.bgYellow(`⚠ ${msg}\n`))
}

module.exports = {
  getSpawnPromise,
  parallelSpawn,
  serialSpawn,
  showError,
  showWarning
}

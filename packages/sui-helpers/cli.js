/* eslint no-console:0 */
const processSpawn = require('child_process').spawn
const CODE_OK = 0
const log = console.log
const colors = require('colors')
const program = require('commander')
const execa = require('execa')
const Listr = require('listr')
const figures = require('figures')
const path = require('path')
const {splitArray} = require('./array')
const isWin = process.platform === 'win32'

/**
 * Spawn several commands in children processes, in series
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function serialSpawn(commands, options = {}) {
  return commands.reduce(function(promise, args) {
    return promise.then(getSpawnPromiseFactory(...args, options))
  }, Promise.resolve())
}

/**
 * Spawn several commands in children processes, in parallel
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function parallelSpawn(commands, options = {}) {
  const symbol = figures.pointer + figures.pointer
  commands = commands.map(([bin, args, opts]) => [
    bin,
    args,
    Object.assign({}, opts, options)
  ])

  log(`${symbol} Running ${commands.length} commands in parallel.`.cyan)
  return spawnList(commands, {concurrent: true})
    .then(() => log(`${commands.length} commands run successfully.`.green))
    .catch(showError)
}

/**
 * Executes n commands as an updating list in the command line
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param {Object} listrOptions Options for listr npm package
 * @param {Number} chunks Number of chunks of tasks to split by to avoid too long output
 */
function spawnList(commands, listrOptions = {}, chunks = 15) {
  let taskList = commands.map(([bin, args, opts, title]) => ({
    title: title || getCommandCallMessage(bin, args, opts),
    task: () => execa(...getArrangedCommand(bin, args, opts))
  }))

  if (!listrOptions.concurrent && chunks && taskList.length > chunks) {
    taskList = splitArray(taskList, chunks).map((chunk, i) => ({
      title: `#${i + 1} group of ${chunk.length} commands...`,
      task: () => new Listr(chunk, listrOptions)
    }))
  }

  const tasks = new Listr(taskList, listrOptions)
  return tasks.run()
}

/**
 * Get a function that returns a promise of given command
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Options to pass to child_process.spawn call
 * @return {Function} Function to execute to get the promise
 */
function getSpawnPromiseFactory(bin, args, options) {
  return function() {
    return getSpawnPromise(bin, args, options)
  }
}

/**
 * Spawn given command and return a promise of the exit code value
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Options to pass to child_process.spawn call
 * @return {Promise<Number>} Process exit code
 */
function getSpawnPromise(bin, args, options = {}) {
  return new Promise(function(resolve, reject) {
    if (options.stdio !== 'ignore') {
      log('')
      log(getCommandCallMessage(bin, args, options))
    }
    getSpawnProcess(bin, args, options).on('exit', code => {
      code === CODE_OK ? resolve(code) : reject(code)
    })
  })
}

/**
 * Spawn given command and return a promise of the exit code value
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} [options={shell: true, stdio: 'inherit'}] Options to pass to child_process.spawn call
 * @return {ChildProcess}
 */
function getSpawnProcess(bin, args, options = {}) {
  options = Object.assign(
    {shell: true, stdio: 'inherit', cwd: process.cwd()},
    options
  )
  return processSpawn(...getArrangedCommand(bin, args, options))
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
 * @param  {Object} Options to pass to child_process.spawn call
 * @return {Striog}
 */
function getCommandCallMessage(bin, args, options = {}) {
  const folder = options.cwd
    ? '@' +
      options.cwd
        .split(path.sep)
        .slice(-2)
        .join(path.sep)
    : ''
  const command = bin.split(path.sep).pop() + ' ' + args.join(' ')
  return `${command} ${folder.grey}`
}

/*
 * Shows an error in the command line and exits process
 * It also outputs help content of the command
 * The program param will have commander instance to output the help command
 * @param  {String} msg
 * @param  {Object} foreignProgram
 * @return
 */
const showError = (msg, foreignProgram) => {
  const logRed = txt => console.log(colors.red(txt))
  logRed(
    `\n${figures.cross} An error occurred during command execution. Info:\n`
  )
  logRed(colors.red(msg)) // eslint-disable-line no-console
  foreignProgram
    ? foreignProgram.outputHelp(txt => txt)
    : program.outputHelp(txt => txt)

  process.exit(1)
}

/*
 * Shows a visible warning message the command line.
 * @param  {String} msg
 * @return
 */
const showWarning = msg => {
  const logYellow = txt =>
    console.log(colors.black.bgYellow(`${figures.warning} ${txt}`)) // eslint-disable-line no-console
  logYellow(msg)
}

module.exports = {
  serialSpawn,
  parallelSpawn,
  spawnList,
  getSpawnPromiseFactory,
  getSpawnPromise,
  showError,
  showWarning
}

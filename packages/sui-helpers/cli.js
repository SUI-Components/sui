/* eslint no-console:0 */
const processSpawn = require('child_process').spawn
const CODE_OK = 0
const log = console.log
const colors = require('colors')
const program = require('commander')


/**
 * Spawn several commands in children processes, in series
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function serialSpawn (commands, options = {}) {
  return commands.reduce(function (promise, args) {
    return promise.then(getSpawnPromiseFactory(...args, options))
  }, Promise.resolve())
}

/**
 * Spawn several commands in children processes, in parallel
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function parallelSpawn (commands, options = {}) {
  options.stdio = 'pipe'
  log(`Running ${commands.length} commands in parallel. Please wait...`.cyan)
  const promises = commands.map(command => new Promise((resolve, reject) => {
    let [bin, args, opts] = command
    let stdout = ''
    let stderr = ''
    opts = Object.assign({}, opts, options)

    let child = getSpawnProcess(bin, args, opts)
    child.stdout.on('data', (data) => { stdout += data.toString() })
    child.stderr.on('data', (data) => { stderr += data.toString() })
    child.on('exit', (code) => {
      log(getCommandCallMessage(bin, args, opts))
      log(stdout)
      log(stderr)
      code === CODE_OK ? resolve(code) : reject(code)
    })
  })
  )
  return Promise.all(promises)
    .then(() => log(`${commands.length} commands run successfully.`.cyan))
}

/**
 * Get a function that returns a promise of given command
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Options to pass to child_process.spawn call
 * @return {Function} Function to execute to get the promise
 */
function getSpawnPromiseFactory (bin, args, options) {
  return function () {
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
function getSpawnPromise (bin, args, options = {}) {
  return new Promise(function (resolve, reject) {
    log(getCommandCallMessage(bin, args, options))
    getSpawnProcess(bin, args, options)
      .on('exit', (code) => {
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
function getSpawnProcess (bin, args, options = {}) {
  options = Object.assign({shell: true, stdio: 'inherit', cwd: process.cwd()}, options)
  return processSpawn(bin, args, options)
}

/**
 * Get caption presenting comman execution in a folder
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} Options to pass to child_process.spawn call
 * @return {Striog}
 */
function getCommandCallMessage (bin, args, options = {}) {
  const folder = options.cwd ? '@' + options.cwd.split('/').slice(-2).join('/') : ''
  const command = bin.split('/').pop() + ' ' + args.join(' ')
  return `\n${command.magenta} ${folder.grey}`
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
  foreignProgram ? foreignProgram.outputHelp(txt => colors.red(txt)) : program.outputHelp(txt => colors.red(txt))
  console.error(colors.red(msg))// eslint-disable-line no-console
  process.exit(1)
}

module.exports = {
  serialSpawn,
  parallelSpawn,
  getSpawnPromiseFactory,
  getSpawnPromise,
  showError
}

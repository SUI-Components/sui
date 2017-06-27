/* eslint no-console:0 */
require('colors')
const spawn = require('child_process').spawn
const CODE_OK = 0

/**
 * Spawn several commands in children processes
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
 * Spawn fiven command and return a promise of the exit code value
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} [options={shell: true, stdio: 'inherit'}] Options to pass to child_process.spawn call
 * @return {Promise<Number>} Process exit code
 */
function getSpawnPromise (bin, args, options = {}) {
  const folder = options.cwd ? '@' + options.cwd.split('/').slice(-2).join('/') : ''
  const command = bin.split('/').pop() + ' ' + args.join(' ')
  options = Object.assign({shell: true, stdio: 'inherit', cwd: process.cwd()}, options)
  console.log(`\n${command.magenta} ${folder.grey}`)
  return new Promise(function (resolve, reject) {
    spawn(bin, args, options)
      .on('exit', (code) => {
        code === CODE_OK ? resolve(code) : reject(code)
      })
  })
}

module.exports = {
  serialSpawn,
  getSpawnPromiseFactory,
  getSpawnPromise
}

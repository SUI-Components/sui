/**
 * Given a list of promises it executes them in sequence.
 * Usefull when execution order mathers and you dont want to execute in parallel
 *
 * It reduces the list of promises creating a list of results
 * It creates an empty array and adds one promise. waits for "all" to finish
 * and proceeds to the next reduce step adding a new unresolved promise.
 *
 * From: https://gist.github.com/istarkov/a42b3bd1f2a9da393554
 *
 * @param {Array<Function<Promise>>} promises Promises should be an array of functions with promises inside
 */
const seq = (promises) => promises.reduce(
  (acc, promise) => acc.then(results => Promise.all([...results, promise()])),
  Promise.resolve([])
)

/**
 * Performs a set of commands in a sequence
 */
const serialExecution = (options) => (commands) => seq(commands.map((cmd) => () => exec(cmd, options)))

/**
 * Executes the given command in a child process
 */
const exec = (cmd, options) => new Promise((resolve, reject) => {
  const child_process = require('child_process')
  const proc = child_process.spawn(cmd[0], cmd[1], options)
  proc.on('exit', (code) => {
    if (code) {
      reject(new Error('command "' + cmd.join(' ') + '" exited with wrong status code "' + code + '"'))
    }

    resolve()
  })
  .on('error', reject)
})

module.exports = {
  serialExecution,
  seq
}

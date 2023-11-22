/* eslint no-console:0 */
const execa = require('execa')
const {default: Queue} = require('p-queue')
const path = require('path')

const logUpdate = require('./log-update.js')
const colors = require('./colors.js')

const CODE_OK = 0

/**
 * Spawn several commands in children processes, in series
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function serialSpawn(commands, options = {}) {
  return commands.reduce((promise, args) => promise.then(() => getSpawnPromise(...args, options)), Promise.resolve())
}

/**
 * Spawn several commands in children processes, in parallel
 * @param  {Array} commands Binary with array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options Default options for given commands
 * @return {Promise<Number>} Resolved with exit code, when all commands where executed on one failed.
 */
function parallelSpawn(commands, options = {}) {
  const {chunks = 15, title} = options

  commands = commands.map(([bin, args, opts]) => [bin, args, {...opts, ...options}])

  const commandsTitle = title || 'commands'

  console.log(colors.cyan(`›› Running ${commands.length} ${commandsTitle} in parallel.`))

  return spawnList(commands, {chunks, title})
    .then(() => {
      logUpdate.done(colors.green(`✔ ${commands.length} ${commandsTitle} run successfully.`))
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
  const logUpdateProgress = (title, pending) => {
    const pendingMessage = colors.cyan(`${pending} of ${commands.length} pending`)
    logUpdate(`› ${title} ─ ${pendingMessage}`)
  }

  if (title) logUpdateProgress(title, commands.length)

  commands.map(([bin, args, opts, titleFromCommand]) =>
    queue
      .add(() =>
        execa(bin, args, opts).catch(e => {
          console.error(bin, args, opts)
          console.error(e)
        })
      )
      .then(() => {
        const titleToUse = title || titleFromCommand || getCommandCallMessage(bin, args, opts)
        const {size, pending} = queue
        const totalPending = size + pending
        logUpdateProgress(titleToUse, totalPending)
      })
  )

  return queue.onIdle()
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
    console.log('')
    console.log(getCommandCallMessage(bin, args, options))
  }

  const execaOptions = {
    shell: true,
    stdio: 'inherit',
    cwd: process.cwd(),
    ...options
  }

  return execa(bin, args, execaOptions).then(() => CODE_OK)
}

/**
 * Get caption presenting comman execution in a folder
 * @param  {String} bin     Binary path or alias
 * @param  {Array} args    Array of args, like ['npm', ['run', 'test']]
 * @param  {Object} options to pass to child_process.spawn call
 * @return {String}
 */
function getCommandCallMessage(bin, args, options = {}) {
  const folder = options.cwd ? options.cwd.split(path.sep).slice(-2).join(path.sep) : ''

  const command = bin.split(path.sep).pop() + ' ' + args.join(' ')
  return `${colors.bold(command)} ${colors.cyan(folder)}`
}

/**
 * Shows an error in the command line and exits process
 * It also outputs help content of the command
 * The program param will have commander instance to output the help command
 * @param  {String} msg
 * @param  {Object} foreignProgram
 */
const showError = (msg, foreignProgram) => {
  console.error(colors.red(`✖ Error: ${msg}\n`))
  foreignProgram && foreignProgram.outputHelp(txt => txt)
  process.exit(1)
}

/**
 * Shows a visible warning message the command line.
 * @param {String} msg
 */
const showWarning = msg => {
  console.warn(colors.yellow(`⚠ ${msg}\n`))
}

module.exports = {
  getSpawnPromise,
  parallelSpawn,
  serialSpawn,
  showError,
  showWarning
}

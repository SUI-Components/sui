#!/usr/bin/env node
/* eslint no-console:0 */
require('colors')
const program = require('commander')
const {basename} = require('path')
const config = require('../src/config')
const {serialSpawn, showError} = require('@s-ui/helpers/cli')
const {splitArray} = require('@s-ui/helpers/array')
const Listr = require('listr')

const DEFAULT_CHUNK = 20

program
  .option(
    '-c, --chunk <number>',
    `Execute by chunks of N packages (defaults to ${DEFAULT_CHUNK})`
  )
  .option(
    '--no-progress',
    'Force to not show progress of tasks (not loading icons)'
  )
  .on('--help', () => {
    console.log(`
  Description:
    Removes node_modules folder and reinstalls dependencies
    in all packages.
    Equivalent to 'npx rimraf node_modules && npm i' but works on any environment and
    executes it concurrently on each package (and/or on your project root folder).

  Examples:
    $ sui-mono phoenix`)
  })
  .parse(process.argv)

const RIMRAF_CMD = [
  require.resolve('rimraf/bin'),
  ['package-lock.json', 'node_modules']
]
const NPM_CMD = ['npm', ['install']]
let {chunk = DEFAULT_CHUNK, progress} = program
chunk = Number(chunk)

const executePhoenixOnPackages = () => {
  if (config.isMonoPackage()) {
    return
  }
  let taskList = config
    .getScopesPaths()
    .map(cwd => [
      [...RIMRAF_CMD, {cwd, stdio: 'ignore'}],
      [...NPM_CMD, {cwd, stdio: 'ignore'}]
    ])
    .map(commands => ({
      title:
        'rimraf node_modules && npm i ' +
        ('@' + basename(commands[0][2].cwd)).grey,
      task: () => serialSpawn(commands)
    }))

  const withChunks = !!chunk && taskList.length > chunk
  if (withChunks) {
    taskList = splitArray(taskList, chunk).map((group, i) => {
      const subTitle = progress
        ? ''
        : '\n' + group.map(task => task.title).join('\n')

      return {
        title: `#${i + 1} group of ${group.length} packages...` + subTitle,
        task: () => new Listr(group, {concurrent: true})
      }
    })
  }

  const tasks = new Listr(taskList, {
    concurrent: !withChunks,
    renderer: !progress ? PlainTextRenderer : null
  })
  return tasks.run()
}

class PlainTextRenderer {
  constructor(tasks, options) {
    this._tasks = tasks
  }

  render() {
    this._tasks.forEach(task =>
      task.subscribe(event => {
        if (event.type === 'STATE') {
          console.log(
            task.isPending()
              ? task.title + '\n' + '... work in progress ...'.yellow
              : '... completed successfully!'.green + '\n'
          )
        }
      })
    )
  }

  end(err) {
    err && showError(err, program)
  }
}

serialSpawn([RIMRAF_CMD, NPM_CMD])
  .then(executePhoenixOnPackages)
  .catch(showError)

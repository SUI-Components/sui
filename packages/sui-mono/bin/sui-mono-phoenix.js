#!/usr/bin/env node
/* eslint no-console:0 */
require('colors')
const program = require('commander')
const {basename} = require('path')
const config = require('../src/config')
const {serialSpawn, showError} = require('@s-ui/helpers/cli')
const Listr = require('listr')

program
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

const RIMRAF_CMD = [require.resolve('rimraf/bin'), ['node_modules']]
const NPM_CMD = ['npm', ['install']]

const executePhoenixOnPackages = () => {
  if (config.isMonoPackage()) {
    return
  }
  const taskList = config.getScopesPaths()
    .map(cwd => [
      [...RIMRAF_CMD, {cwd, stdio: 'ignore'}],
      [...NPM_CMD, {cwd, stdio: 'ignore'}]
    ])
    .map((commands) => ({
      title: 'rimraf node_modules && npm i ' + ('@' + basename(commands[0][2].cwd)).grey,
      task: () => new Promise(resolve => {
        serialSpawn(commands).then(resolve)
          .catch(error => console.log(error))
      })
    }))
  const tasks = new Listr(taskList, {concurrent: true})
  return tasks.run()
}

serialSpawn([
  RIMRAF_CMD,
  NPM_CMD
])
  .then(executePhoenixOnPackages)
  .catch(showError)

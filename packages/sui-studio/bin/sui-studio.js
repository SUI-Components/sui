#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const path = require('path')
const {getSpawnPromise} = require('@s-ui/helpers/cli')

const {version} = require('../package.json')
const copyStaticFiles = require('./helpers/copyStaticFiles.js')
const copyGlobals = require('./helpers/copyGlobals.js')

program.version(version, '    --version')

program
  .command('start')
  .alias('s')
  .action(async () => {
    console.info('[deprecated] Use `sui-studio dev` to develop components')

    await copyGlobals()
    await copyStaticFiles()

    const devServerExec = require.resolve('@s-ui/bundler/bin/sui-bundler-dev')
    const args = ['-c', path.join(__dirname, '..', 'src')]
    getSpawnPromise(devServerExec, args, {
      shell: false
    }).then(process.exit, process.exit)
  })

program.command('dev <component>', 'Develop an isolate component').alias('d')

program
  .command(
    'generate <category> <component>',
    'Create a component and her demo files'
  )
  .alias('g')

program
  .command('build', 'Generate a static version ready to be deployed')
  .alias('b')

program
  .command('link <origin> <destination>', 'Link components between them')
  .alias('l')

program.command('test', 'Run studio tests').alias('t')

program
  .command('migrate <topic>', 'Migrate any legacy topic to the new structure')
  .alias('m')

program.parse(process.argv)

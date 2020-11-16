#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const path = require('path')
const {getSpawnPromise} = require('@s-ui/helpers/cli')
const {version} = require('../package.json')
const copyStaticFiles = require('./helpers/copyStaticFiles')
const copyGlobals = require('./helpers/copyGlobals')

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

program.command('commit', 'Commit with semantic messages.').alias('co')

program.command('release', 'Release whatever need to be release').alias('r')

program.command('check-release', 'Which packages must be updates').alias('cr')

program
  .command(
    'run-all <command>',
    'Run, in series, the same command in each component'
  )
  .alias('ra')

program
  .command(
    'run-parallel <command>',
    'Run, in parallel, the same command in each component'
  )
  .alias('rp')

program
  .command('link-all <command>', 'Link all components between each other')
  .alias('la')

program
  .command('link <origin> <destination>', 'Link components between them')
  .alias('l')

program.command('init <project>', 'Create a new project').alias('i')

program.command('test', 'Run studio tests').alias('t')

program.parse(process.argv)

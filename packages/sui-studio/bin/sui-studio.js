#!/usr/bin/env node
/* eslint no-console:0 */

require('fs.realpath').monkeypatch()

const program = require('commander')
const {execFile} = require('child_process')
const {join} = require('path')
const pkg = require('../package.json')

const version = pkg.version

program
  .version(version, '    --version')

program
  .command('start').alias('s')
  .option('-d, --dir-base [dir]', 'Setup base dir where live src and demo folders', '.')
  .action(({dirBase}) => {
    const devServerExec = join(__dirname, '..', 'node_modules', '@schibstedspain', 'suistudio-webpack', 'bin', 'suistudio-webpack-dev.js')
    const child = execFile(
      devServerExec,
      [],
      {cwd: join(__dirname, '..'), maxBuffer: 1024 * 500, env: process.env},
      console.log.bind(console)
    )
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  })

program
  .command('generate <category> <component>', 'Create a component and her demo files').alias('g')

program
  .command('build', 'Generate a static versión ready to be deploy to surge.sh or GH-Pages').alias('b')

program
  .command('release', 'Release whatever need to be release').alias('r')

program
  .command('check-release', 'Which packages must be updates').alias('cr')

program
  .command('run-all <command>', 'Run the same command in each component').alias('ra')

program
  .command('link <origin> <destination>', 'Link components between them').alias('l')

program
  .command('init <project>', 'Create a new project').alias('i')

program
  .command('clean-modules', 'Remove node_module folder in each component').alias('cm')

program.parse(process.argv)

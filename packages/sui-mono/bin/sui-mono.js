#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('commit', 'Commits the current stashed work')

program.command('commit-all', 'Do same commit for all packages')

program.command('check', 'Gives information if something should be updated')

program.command('changelog', 'Generate CHANGELOG.md files')

program.command('phoenix', 'Reset project and packages reinstalling all dependencies')

program.command('release', 'Release whatever need to be release')

program.command('run', 'Run a command on each package, in series')

program.command('run-parallel', 'Run a command on each package, in parallel')

program.parse(process.argv)

#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const pkg = require('../package.json')
const version = pkg.version

program
  .version(version, '    --version')

program
  .command('commit', 'Commits the current stashed work')

program
  .command('check', 'Gives information if something should be updated')

program
  .command('release', 'Release whatever need to be release')



program.parse(process.argv)

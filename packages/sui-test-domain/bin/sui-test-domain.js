#!/usr/bin/env node
const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program
  .version(version, '    --version')

program
  .command('browser', 'Start a development server for a page').alias('b')

program
  .command('server', 'Start a development server for a page').alias('s')

program.parse(process.argv)

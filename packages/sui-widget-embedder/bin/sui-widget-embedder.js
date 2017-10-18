#!/usr/bin/env node

const program = require('commander')
// const colors = require('colors')

const pkg = require('../package.json')
const version = pkg.version

program
  .version(version, '    --version')

program
  .command('development', 'Start a development server for a page').alias('d')

program
  .command('build', 'Build all statics by page').alias('b')

program.parse(process.argv)

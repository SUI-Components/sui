#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command('dev', 'Start a development server for a page').alias('d')

program.command('build', 'Build all statics by page').alias('b')

program
  .command(
    'generate',
    'Generate a new page folder and main files with your first widget'
  )
  .alias('g')

program.parse(process.argv)

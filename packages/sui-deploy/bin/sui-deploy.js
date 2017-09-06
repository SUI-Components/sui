#!/usr/bin/env node
const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program
  .version(version, '    --version')

program
  .command('spa <name> [build-folder]', 'deploy single-page application')

program.parse(process.argv)

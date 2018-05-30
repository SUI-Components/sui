#!/usr/bin/env node
const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program
  .command('js', 'lint javascript files')
  .command('sass', 'lint sass files')

program.parse(process.argv)

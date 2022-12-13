#!/usr/bin/env node
const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command('browser', 'Run tests in the browser').alias('b')

program.command('server', 'Run tests in node').alias('s')

program.command('jest', 'Run tests with jest').alias('j')

program.parse(process.argv)

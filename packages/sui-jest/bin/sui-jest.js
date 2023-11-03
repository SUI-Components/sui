#!/usr/bin/env node
const program = require('commander')

// Setup default env vars
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command('browser', 'Run tests in the browser').alias('b')

program.command('server', 'Run tests in node').alias('s')

program.parse(process.argv)

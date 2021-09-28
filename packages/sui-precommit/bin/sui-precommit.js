#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command('install', 'add precommit rules to git hook')

program.parse(process.argv)

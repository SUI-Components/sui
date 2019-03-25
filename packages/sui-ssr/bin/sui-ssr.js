#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command('build', 'Build a ssr server').alias('b')
program.command('archive', 'Create a server.zip file').alias('a')
program.command('release', 'Release new version of the server').alias('r')

program.parse(process.argv)

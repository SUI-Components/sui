#!/usr/bin/env node

const program = require('commander')

const {version} = require('../package.json')

program.version(version, '    --version')

program.command('build', 'Build a ssr server').alias('b')
program.command('archive', 'Create a server.zip file').alias('a')
program.command('release', 'Release new version of the server').alias('r')
program.command('dev', 'Start a ssr server in development mode').alias('d')

program.parse(process.argv)

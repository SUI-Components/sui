#!/usr/bin/env node

const program = require('commander')
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('build', 'Builds React components from svg files')
program.command('demo', 'Loads a local static website')

program.parse(process.argv)

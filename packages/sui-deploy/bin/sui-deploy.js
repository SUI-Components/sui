#!/usr/bin/env node
const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command('spa <name> [folder]', 'deploy a single-page application')

program.command('dir <name> [folder]', 'deploy a folder', {isDefault: true})

program.parse(process.argv)

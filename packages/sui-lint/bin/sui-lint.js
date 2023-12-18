#!/usr/bin/env node
const program = require('commander')
const {version} = require('../package.json')

program.version(version, '    --version')

program.command('js', 'lint javascript files').command('sass', 'lint sass files')

program.parse(process.argv)

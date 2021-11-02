#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const pkg = require('../package.json')
const {version} = pkg

program.version(version, '    --version')

program.command('components', 'Update several metrics about sui-components')

program.parse(process.argv)

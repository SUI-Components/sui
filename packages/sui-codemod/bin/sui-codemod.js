#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program.version(version, '    --version')

program.command(
  'contextByProps',
  'Rewrite components to use domain and i18n like a regular props. Apply pattern index/component'
)

program.parse(process.argv)

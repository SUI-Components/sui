#!/usr/bin/env node
const program = require('commander')
const {version} = require('../package.json')

program
  .version(version, '--version')
  .command('publish', 'Publish existing test contracts.')

program.parse(process.argv)

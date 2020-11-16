#!/usr/bin/env node
const program = require('commander')

const {version} = require('../package.json')

program
  .version(version)
  .command('update-commit-status', 'update a GitHub Commit Status')
  .command('release', 'release packages on Travis CI')

program.parse(process.argv)

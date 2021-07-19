#!/usr/bin/env node
import program from 'commander'
import {createRequire} from 'module'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program
  .version(version, '    --version')
  .command('update-commit-status', 'update a GitHub Commit Status')
  .command('release', 'release packages on Travis CI')

program.parse(process.argv)

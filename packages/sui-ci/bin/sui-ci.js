#!/usr/bin/env node
import {createRequire} from 'module'

import program from 'commander'

const require = createRequire(import.meta.url)
const {version} = require('../package.json')

program
  .version(version, '    --version')
  .command('update-commit-status', 'update a GitHub Commit Status')
  .command('release', 'release packages on Travis CI')

program.parse(process.argv)

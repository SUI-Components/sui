#!/usr/bin/env node

const { executeLintingCommand, getGitIgnoredFiles } = require('../src/helpers')
const BIN_PATH = require.resolve('sass-lint/bin/sass-lint')
const CONFIG_PATH = require.resolve('../sass-lint.yml')
const IGNORE_PATTERNS = ['**/node_modules/**', '**/lib/**', '**/dist/**']

const patterns = IGNORE_PATTERNS.concat(getGitIgnoredFiles())

executeLintingCommand(BIN_PATH, [
  '-c',
  CONFIG_PATH,
  '-i',
  `'${patterns.join(', ')}'`,
  '-v',
  '**/src/**/*.scss'
])

#!/usr/bin/env node

const {
  executeLintingCommand,
  getFileLinesAsArray,
  getIgnorePatterns
} = require('../src/helpers')
const BIN_PATH = require.resolve('eslint/bin/eslint')
const CONFIG_PATH = require.resolve('../eslintrc.js')
const IGNORE_PATTERNS = ['lib', 'dist', 'public', 'node_modules']
const GIT_IGNORE_PATH = `${process.cwd()}/.gitignore`

const patterns = IGNORE_PATTERNS.concat(getFileLinesAsArray(GIT_IGNORE_PATH))

executeLintingCommand(BIN_PATH, [
  `-c ${CONFIG_PATH}`,
  '--ext js',
  '--ext jsx',
  ...getIgnorePatterns(patterns),
  './'
])

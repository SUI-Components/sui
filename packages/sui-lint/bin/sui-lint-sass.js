#!/usr/bin/env node
/* eslint-disable no-console */
const program = require('commander')

const {
  executeLintingCommand,
  getGitIgnoredFiles,
  getFilesToLint
} = require('../src/helpers')
const BIN_PATH = require.resolve('stylelint/bin/stylelint')
const CONFIG_PATH = require.resolve('../stylelint.config.js')
const EXTENSIONS = ['scss']
const IGNORE_PATTERNS = ['**/node_modules/**', '**/lib/**', '**/dist/**']

const patterns = IGNORE_PATTERNS.concat(getGitIgnoredFiles())

program
  .option('--add-fixes')
  .option('--staged')
  .option('--fix', 'fix automatically problems with sass files')
  .option('--pattern <pattern>', 'root path to locate the sass files')
  .parse(process.argv)

getFilesToLint(EXTENSIONS, program.pattern || '**/src/**/*.scss').then(
  files =>
    (files.length &&
      executeLintingCommand(BIN_PATH, [
        files
          .reduce((acc, file) => (acc += file + "' '"), " '")
          .replace(/'$/, ''),

        '--config',
        CONFIG_PATH,
        '--ignore-pattern',
        `'${patterns.join(', ')}'`
      ])) ||
    console.log('[sui-lint sass] No sass files to lint.')
)

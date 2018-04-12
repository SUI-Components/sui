#!/usr/bin/env node
/* eslint-disable no-console */
const {
  executeLintingCommand,
  getArrayArgs,
  getFilesToLint,
  getGitIgnoredFiles,
  isOptionSet,
  stageFilesIfRequired
} = require('../src/helpers')

const BIN_PATH = require.resolve('eslint/bin/eslint')
const CONFIG_PATH = require.resolve('../eslintrc.js')
const EXTENSIONS = ['js', 'jsx']
const IGNORE_PATTERNS = ['lib', 'dist', 'public', 'node_modules']

const patterns = IGNORE_PATTERNS.concat(getGitIgnoredFiles())

getFilesToLint(EXTENSIONS).then(
  files =>
    (files.length &&
      executeLintingCommand(BIN_PATH, [
        `-c ${CONFIG_PATH}`,
        ...getArrayArgs('--ext', EXTENSIONS),
        ...getArrayArgs('--ignore-pattern', patterns),
        ...files
      ]).then(
        () => isOptionSet('--fix') && stageFilesIfRequired(EXTENSIONS)
      )) ||
    console.log('[sui-lint js] No javascript files to lint.')
)

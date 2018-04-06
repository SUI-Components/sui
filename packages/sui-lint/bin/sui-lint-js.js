#!/usr/bin/env node

const {
  executeLintingCommand,
  getFileLinesAsArray,
  getArrayArgs,
  getFilesToLint
} = require('../src/helpers')
const BIN_PATH = require.resolve('eslint/bin/eslint')
const CONFIG_PATH = require.resolve('../eslintrc.js')
const EXTENSIONS = ['js', 'jsx']
const IGNORE_PATTERNS = ['lib', 'dist', 'public', 'node_modules']
const GIT_IGNORE_PATH = `${process.cwd()}/.gitignore`

const patterns = IGNORE_PATTERNS.concat(getFileLinesAsArray(GIT_IGNORE_PATH))

getFilesToLint(EXTENSIONS).then(
  files =>
    (files.length &&
      executeLintingCommand(BIN_PATH, [
        `-c ${CONFIG_PATH}`,
        ...getArrayArgs('--ext', EXTENSIONS),
        ...getArrayArgs('--ignore-pattern', patterns),
        ...files
      ])) ||
    console.log('[sui-lint js] No javascript files to lint.')
)

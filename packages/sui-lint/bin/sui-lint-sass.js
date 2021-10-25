#!/usr/bin/env node
/* eslint-disable no-console */
// @ts-check

const program = require('commander')
const stylelint = require('stylelint')
const config = require('../stylelint.config.js')
const {
  checkFilesToLint,
  getGitIgnoredFiles,
  getFilesToLint
} = require('../src/helpers')

const EXTENSIONS = ['scss']
const IGNORE_PATTERNS = ['**/node_modules/**', '**/lib/**', '**/dist/**']

program
  .option('--add-fixes')
  .option('--staged')
  .option('--fix', 'fix automatically problems with sass files')
  .option(
    '--pattern <pattern>',
    'root path to locate the sass files',
    '**/*.scss'
  )
  .parse(process.argv)

getFilesToLint(EXTENSIONS, program.pattern).then(files => {
  if (!checkFilesToLint({files, language: 'SCSS'})) return

  return stylelint
    .lint({
      customSyntax: require.resolve('postcss-scss'),
      files,
      formatter: 'string',
      config: {
        ...config,
        ignoreFiles: IGNORE_PATTERNS.concat(getGitIgnoredFiles())
      }
    })
    .then(({output, errored}) => {
      console.log(output)

      if (errored) {
        throw new Error('You must fix linting errores before continuing...')
      }
    })
    .catch(error => {
      process.exitCode = 1
      console.error('[sui-lint]', error)
    })
})

#!/usr/bin/env node
/* eslint-disable no-console */
const program = require('commander')
const stylelint = require('stylelint')
const config = require('../stylelint.config.js')
const {getGitIgnoredFiles, getFilesToLint} = require('../src/helpers')

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
  if (!files.length) {
    console.log('[sui-lint] No SCSS files to lint.')
    return
  }

  console.log(`[sui-lint] Linting ${files.length} SCSS files...`)

  return stylelint
    .lint({
      files,
      formatter: 'string',
      syntax: 'scss',
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

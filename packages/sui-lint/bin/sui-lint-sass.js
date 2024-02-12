#!/usr/bin/env node
/* eslint-disable no-console */
// @ts-check

import program from 'commander'
import stylelint from 'stylelint'

import {checkFilesToLint, getFilesToLint, getGitIgnoredFiles, stageFilesIfRequired} from '../src/helpers.js'
import config from '../stylelint.config.js'

const EXTENSIONS = ['scss']
const IGNORE_PATTERNS = ['**/node_modules/**', '**/lib/**', '**/dist/**']
const DEFAULT_PATTERN = '**/*.scss'

program
  .option('--add-fixes')
  .option('--staged')
  .option('--fix', 'fix automatically problems with sass files')
  .option('--pattern <pattern>', 'root path to locate the sass files', DEFAULT_PATTERN)
  .parse(process.argv)

const {addFixes, fix, pattern, staged} = program.opts()

getFilesToLint({extensions: EXTENSIONS, defaultPattern: pattern, staged}).then(files => {
  if (
    !checkFilesToLint({
      files,
      language: 'SCSS',
      defaultPattern: DEFAULT_PATTERN
    })
  )
    return

  return stylelint
    .lint({
      files,
      formatter: 'string',
      config: {
        ...config,
        ignoreFiles: IGNORE_PATTERNS.concat(getGitIgnoredFiles())
      },
      fix
    })
    .then(({report, errored}) => {
      console.log(report)

      if (fix) {
        stageFilesIfRequired({extensions: EXTENSIONS, staged, addFixes})
      }

      if (errored) {
        throw new Error('You must fix linting errors before continuing...')
      }
    })
    .catch(error => {
      process.exitCode = 1
      console.error('[sui-lint]', error)
    })
})

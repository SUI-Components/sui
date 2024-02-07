#!/usr/bin/env node
/* eslint-disable no-console */
// @ts-check

const program = require('commander')
const {checkFilesToLint, getFilesToLint, getGitIgnoredFiles, stageFilesIfRequired} = require('../src/helpers.js')

const {ESLint} = require('eslint')
const config = require('../eslintrc.js')
const {Reporter} = require('../src/reporter.js')

program
  .option('--add-fixes')
  .option('--staged')
  .option('--fix', 'fix automatically problems with js files')
  .option('--ignore-patterns <ignorePatterns...>', 'Path patterns to ignore for linting')
  .option('--report', 'Send results to DD using sui-logger')
  .option('--pattern <pattern>', 'Send results to DD using sui-logger')
  .parse(process.argv)

const {addFixes, fix, ignorePatterns = [], staged, pattern, report} = program.opts()

const {CI} = process.env
const EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']
const IGNORE_PATTERNS = ['lib', 'dist', 'public', 'node_modules']
const DEFAULT_PATTERN = pattern ?? './'
const LINT_FORMATTER = 'stylish'
const baseConfig = {
  ...config,
  ignorePatterns: IGNORE_PATTERNS.concat(getGitIgnoredFiles()).concat(ignorePatterns)
}

;(async function main() {
  const files = await getFilesToLint({
    extensions: EXTENSIONS,
    defaultPattern: DEFAULT_PATTERN,
    staged
  })
  if (
    !checkFilesToLint({
      files,
      language: 'JavaScript',
      defaultPattern: DEFAULT_PATTERN
    })
  )
    return

  const eslint = new ESLint({
    baseConfig,
    fix,
    extensions: EXTENSIONS,
    useEslintrc: false
  })

  const results = await eslint.lintFiles(files)

  if (report) {
    debugger
    console.log('[sui-lint] Generating report and send it to DD')
    Reporter.create().map(results)
  }

  if (fix) {
    await ESLint.outputFixes(results)
    stageFilesIfRequired({extensions: EXTENSIONS, staged, addFixes})
  }

  const formatter = await eslint.loadFormatter(LINT_FORMATTER)
  const errors = ESLint.getErrorResults(results)

  const resultsToShow = CI ? errors : results
  const resultText = formatter.format(resultsToShow)

  console.log(resultText)

  if (errors.length > 0) {
    throw new Error('You must fix linting errores before continuing...')
  }
})().catch(error => {
  process.exitCode = 1
  console.error('[sui-lint]', error)
})

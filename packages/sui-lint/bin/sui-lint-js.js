#!/usr/bin/env node
/* eslint-disable no-console */
// @ts-check

const path = require('path')
const fs = require('fs')
const program = require('commander')
const {checkFilesToLint, getFilesToLint, getGitIgnoredFiles, stageFilesIfRequired} = require('../src/helpers.js')

const {ESLint} = require('eslint')
const config = fs.existsSync(process.cwd() + '/tsconfig.json')
  ? require('../eslintrc.ts.js')
  : require('../eslintrc.js')

program
  .option('--add-fixes')
  .option('--staged')
  .option('--force-full-lint', 'force to lint all the JS files')
  .option('--fix', 'fix automatically problems with js files')
  .option('--ignore-patterns <ignorePatterns...>', 'Path patterns to ignore for linting')
  .option('--reporter <reporter>', 'Send results using a custom reporter')
  .option('--pattern <pattern>', 'Pattern of files to lint')
  .parse(process.argv)

const {addFixes, fix, ignorePatterns = [], staged, pattern, reporter, forceFullLint} = program.opts()

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

  if (forceFullLint) {
    console.log('[sui-lint] force to lint all our JS files')
  }

  const results = await eslint.lintFiles(!forceFullLint ? files : DEFAULT_PATTERN)

  if (reporter) {
    console.log('[sui-lint] Sending stats using the reporter ', reporter)
    const reporterPath = path.isAbsolute(reporter) ? reporter : path.join(process.cwd() + '/' + reporter)
    console.log({reporter, isAbsolute: path.isAbsolute(reporter), reporterPath})
    const {JSReporter} = await import(reporterPath)
    const reportered = await JSReporter.create()
    await reportered.map(results).send()
    console.log('[sui-lint] All your stats has been sent', reporter)
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

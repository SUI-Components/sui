#!/usr/bin/env node
/* eslint-disable no-console */
const {
  checkFilesToLint,
  getFilesToLint,
  getGitIgnoredFiles,
  isOptionSet,
  stageFilesIfRequired
} = require('../src/helpers')

const {ESLint} = require('eslint')
const config = require('../eslintrc.js')

const {CI} = process.env
const EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']
const IGNORE_PATTERNS = ['lib', 'dist', 'public', 'node_modules']
const LINT_FORMATTER = 'stylish'

const baseConfig = {
  ...config,
  ignorePatterns: IGNORE_PATTERNS.concat(getGitIgnoredFiles())
}

;(async function main() {
  const files = await getFilesToLint(EXTENSIONS)
  if (!checkFilesToLint({files, language: 'JavaScript'})) return

  const fix = isOptionSet('fix')
  const eslint = new ESLint({
    baseConfig,
    fix,
    extensions: EXTENSIONS,
    useEslintrc: false
  })

  const results = await eslint.lintFiles(files)

  if (fix) {
    await ESLint.outputFixes(results)
    stageFilesIfRequired(EXTENSIONS)
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

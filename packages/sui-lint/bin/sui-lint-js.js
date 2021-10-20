#!/usr/bin/env node
/* eslint-disable no-console */
const {
  getFilesToLint,
  getGitIgnoredFiles,
  isOptionSet,
  stageFilesIfRequired
} = require('../src/helpers')

const {ESLint} = require('eslint')
const config = require('../eslintrc.js')

const EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']
const IGNORE_PATTERNS = ['lib', 'dist', 'public', 'node_modules']

const baseConfig = {
  ...config,
  ignorePatterns: IGNORE_PATTERNS.concat(getGitIgnoredFiles())
}
const formatterName = process.env.CI ? 'stylish' : 'codeframe'

;(async function main() {
  const files = await getFilesToLint(EXTENSIONS)
  if (!files.length) {
    console.log('[sui-lint] No JavaScript files to lint')
    return
  }
  console.log(`[sui-lint] Linting ${files.length} JavaScript files...`)

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

  const formatter = await eslint.loadFormatter(formatterName)
  const resultText = formatter.format(results)

  console.log(resultText)
})().catch(error => {
  process.exitCode = 1
  console.error('[sui-lint]', error)
})

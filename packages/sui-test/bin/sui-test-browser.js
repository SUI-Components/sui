#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const colors = require('@s-ui/helpers/colors')
const runner = require('./karma/index.js')

program
  .option('-W, --watch', 'Run in watch mode')
  .option('-C, --ci', 'Run a Firefox headless for CI testing')
  .option('-H, --headless', 'Run a headless browser for testing')
  .option('-P, --pattern <pattern>', 'Path pattern to include', 'test/**/*Spec.+(js|jsx|ts|tsx)')
  .option('-I, --ignore-pattern <ignorePattern>', 'Path pattern to ignore for testing', false)
  .option('--src-pattern <srcPattern>', 'Define the source directory', false)
  .option('-T, --timeout <ms>', 'Timeout', 2000)
  .option('--coverage', 'Run the coverage preprocessor', false)
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Run tests in Chrome')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-test browser')
    console.log('')
  })
  .parse(process.argv)

const {ci, coverage, headless, ignorePattern, pattern, srcPattern, timeout, watch} = program.opts()

runner({
  ci,
  coverage,
  headless,
  ignorePattern,
  pattern,
  srcPattern,
  ...(timeout && {timeout: Number(timeout)}),
  watch
})
  .then(output => {
    if (output != null) process.stdout.write(output + '\n')
    if (!watch) process.exit(0)
  })
  .catch(err => {
    if (!(typeof err.code === 'number' && err.code >= 0 && err.code < 10)) {
      process.stderr.write(colors.red((err && (err.stack || err.message)) || err) + '\n')
    }
    process.exit(err.code || 1)
  })

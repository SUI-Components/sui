#!/usr/bin/env node
/* eslint-disable no-console */
const program = require('commander')
const runner = require('../src/runner.js')

// Setup default env vars
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

program
  .option('-W, --watch', 'Run in watch mode')
  .option('--ci', 'Run a Firefox headless for CI testing')
  .option('-P, --pattern <pattern>', 'Path pattern to include', false)
  .option('-c, --coverage', 'Run the coverage preprocessor', false)
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Run tests in server with Jest')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-jest server')
    console.log('')
  })
  .parse(process.argv)

const {ci, coverage, pattern, watch} = program.opts()

runner({ci, coverage, environment: 'node', pattern, watch})

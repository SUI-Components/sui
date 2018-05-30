#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const path = require('path')
const {serialSpawn} = require('@s-ui/helpers/cli')

program
  .option('-W, --watch', 'Run in watch mode')
  .option('-P, --pattern <pattern>', 'Path pattern to include', 'test')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Run tests in node')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-test server')
    console.log('')
  })
  .parse(process.argv)

const {pattern, watch} = program

serialSpawn([
  [
    require.resolve('mocha/bin/mocha'),
    [
      path.join(process.cwd(), path.sep, pattern),
      `--require ${path.join(__dirname, 'mocha', 'register.js')}`,
      '--recursive',
      watch && '--watch'
    ].filter(Boolean)
  ]
]).catch(err => console.log(err))

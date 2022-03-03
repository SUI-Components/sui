#!/usr/bin/env node
/* eslint no-console:0 */

const path = require('path')
const program = require('commander')
const colors = require('@s-ui/helpers/colors')
const {serialSpawn} = require('@s-ui/helpers/cli')

program
  .option('-I, --inspect', 'Inspect node process')
  .option('-W, --watch', 'Run in watch mode')
  .option('-T, --timeout <ms>', 'Timeout', 2000)
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

const {pattern, watch, inspect, timeout} = program
const ci = Boolean(process.env.CI)

serialSpawn([
  [
    require.resolve('mocha/bin/mocha'),
    [
      path.join(process.cwd(), path.sep, pattern),
      `--require ${path.join(__dirname, 'mocha', 'register.js')}`,
      '--recursive',
      inspect && '--inspect-brk',
      watch && '--watch',
      timeout && `--timeout ${timeout}`,
      ci && `--reporter min`
    ].filter(Boolean),
    {
      env: {
        ...process.env,
        NODE_OPTIONS: `--loader=${path.join(__dirname, 'mocha', 'loader.mjs')}`
      }
    }
  ]
]).catch(err => {
  if (!(typeof err.code === 'number' && err.code >= 0 && err.code < 10)) {
    process.stderr.write(colors.red((err && (err.stack || err.message)) || err))
  }
  process.exit(err.code || 1)
})

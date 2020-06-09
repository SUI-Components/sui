#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander')
const {serialSpawn} = require('@s-ui/helpers/cli')
const path = require('path')

const suiTestClientPath = require.resolve('@s-ui/test/bin/sui-test-browser')

program
  .option('--ci', 'Run compoents tests in CLI, headless mode')
  .option('-W, --watch', 'Watch mode')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio test --ci')
    console.log('    $ sui-studio test --ci -W')
    console.log('    $ sui-studio test --help')
    console.log('')
  })
  .parse(process.argv)

const run = async () => {
  try {
    await serialSpawn([
      [
        suiTestClientPath,
        [
          '--src-pattern', path.join('node_modules', '@s-ui', 'studio', 'src', 'runtime-mocha', 'index.js'), // eslint-disable-line
          program.watch && '--watch',
          program.ci && '--ci'
        ].filter(Boolean),
        {
          shell: false,
          env: process.env
        }
      ]
    ])

    if (!program.watch) {
      process.exit(0)
    }
  } catch (err) {
    console.error(err)
    process.exit(err.code || 1)
  }
}

run()

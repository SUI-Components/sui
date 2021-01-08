#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander')
const {serialSpawn} = require('@s-ui/helpers/cli')
const path = require('path')

const suiTestClientPath = require.resolve('@s-ui/test/bin/sui-test-browser')

program
  .option('-C, --ci', 'Run components tests in CLI, headless mode')
  .option('-W, --watch', 'Watch mode')
  .option('-T, --timeout <timeout>', 'Timeout')
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
    const result = await serialSpawn([
      [
        suiTestClientPath,
        [
          '--src-pattern',
          path.join(
            'node_modules',
            '@s-ui',
            'studio',
            'src',
            'runtime-mocha',
            'index.js'
          ),
          program.watch && '--watch',
          program.ci && '--ci',
          program.timeout && `-T ${program.timeout}`
        ].filter(Boolean),
        {
          shell: false,
          env: process.env
        }
      ]
    ])

    if (program.watch) {
      process.exit(0)
    }

    // if the tests fails results = 1
    process.exit(result)
  } catch (err) {
    console.error(err)
    process.exit(err.code || 1)
  }
}

run()

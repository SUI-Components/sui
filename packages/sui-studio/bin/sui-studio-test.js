#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander')
const {serialSpawn} = require('@s-ui/helpers/cli')
const path = require('path')

const suiTestClientPath = require.resolve('@s-ui/test/bin/sui-test-browser')

program
  .option('-C, --ci', 'Run components tests in CLI, headless mode [deprecated]')
  .option('-H, --headless', 'Run components tests in CLI, headless mode')
  .option('-W, --watch', 'Watch mode')
  .option('-T, --timeout <timeout>', 'Timeout')
  .option('--coverage', 'Create coverage', false)
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio test --headless')
    console.log('    $ sui-studio test --headless --watch')
    console.log('    $ sui-studio test --help')
    console.log('')
  })
  .parse(process.argv)

const {coverage, watch, ci, headless, timeout} = program.opts()

const run = async () => {
  try {
    const result = await serialSpawn([
      [
        suiTestClientPath,
        [
          '--pattern',
          path.join(
            'node_modules',
            '@s-ui',
            'studio',
            'src',
            'runtime-mocha',
            'index.js'
          ),
          coverage && '--coverage',
          watch && '--watch',
          ci && '--ci',
          headless && '--headless',
          timeout && `-T ${timeout}`
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

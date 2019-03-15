#!/usr/bin/env node

const {serialSpawn} = require('@s-ui/helpers/cli')
const BIN_PATH = require.resolve('@s-ui/lint/bin/sui-lint')

serialSpawn([
  [BIN_PATH, ['js', '--staged']],
  [BIN_PATH, ['sass', '--staged']],
  ['npm', ['run', 'test']]
])
  .then(code => process.exit(code))
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })

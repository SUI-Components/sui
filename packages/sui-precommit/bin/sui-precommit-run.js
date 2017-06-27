#!/usr/bin/env node

const serialSpawn = require('../lib/spawn').serialSpawn
const BIN_PATH = require.resolve('@schibstedspain/sui-lint/bin/sui-lint')

serialSpawn([
  [BIN_PATH, ['js']],
  [BIN_PATH, ['sass']],
  ['npm', ['run', 'test']]
])
.then(code => process.exit(code))
.catch(code => process.exit(code))

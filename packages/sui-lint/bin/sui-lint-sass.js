#!/usr/bin/env node

const {executeLintingCommand} = require('../src/helpers')
const BIN_PATH = require.resolve('sass-lint/bin/sass-lint')
const CONFIG_PATH = require.resolve('../sass-lint.yml')

executeLintingCommand(BIN_PATH, [
  '-c', CONFIG_PATH,
  '-i', "'**/node_modules/**/*.scss, **/lib/**/*.scss, **/dist/**/*.scss'",
  '-v',
  '**/src/**/*.scss'
])

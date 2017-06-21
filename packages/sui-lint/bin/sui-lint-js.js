#!/usr/bin/env node

const {executeLintingCommand} = require('../src/helpers')
const BIN_PATH = require.resolve('eslint/bin/eslint')
const CONFIG_PATH = require.resolve('../eslintrc.js')

executeLintingCommand(BIN_PATH, [
  '-c', CONFIG_PATH,
  '--ext', 'js',
  '--ext', 'jsx',
  '--ignore-pattern', 'lib',
  '--ignore-pattern', 'dist',
  '--ignore-pattern', 'node_modules',
  './'
])

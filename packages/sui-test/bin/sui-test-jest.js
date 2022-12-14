#!/usr/bin/env node
const {hasFile} = require('./jest/utils.js')

process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const args = process.argv.slice(2)

const config =
  !args.includes('--config') && !hasFile('jest.config.js')
    ? ['--config', JSON.stringify(require('./jest/config.js'))]
    : []

require('jest').run([...config, ...args])

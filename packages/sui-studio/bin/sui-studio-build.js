#!/usr/bin/env node
/* eslint no-console:0 */

const { serialSpawn } = require('@schibstedspain/sui-helpers/cli')
const {join} = require('path')

console.log('\n', process.env.NODE_ENV, '\n')
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const devServerExec = require.resolve('@schibstedspain/sui-bundler/bin/sui-bundler-build')

serialSpawn([
  [devServerExec, ['-C'], {shell: false, cwd: join(__dirname, '..')}],
  ['cp', ['public/index.html', 'public/200.html']]
])
.then(code => process.exit(code))
.catch(code => process.exit(code))

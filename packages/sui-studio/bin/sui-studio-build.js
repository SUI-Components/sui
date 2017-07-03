#!/usr/bin/env node
/* eslint no-console:0 */

const { getSpawnPromise } = require('@schibstedspain/sui-helpers/cli')
const {join} = require('path')

console.log('\n', process.env.NODE_ENV, '\n')
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const devServerExec = require.resolve('@schibstedspain/sui-bundler/bin/sui-bundler-build')

getSpawnPromise(devServerExec, ['-C'], {shell: false, cwd: join(__dirname, '..')})
  .then(code => console.log('You may want to deply the directory to surge.sh'))
  .catch(code => process.exit(code))

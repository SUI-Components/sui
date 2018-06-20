#!/usr/bin/env node
/* eslint no-console:0 */

const {serialSpawn} = require('@s-ui/helpers/cli')
const {join} = require('path')
const fs = require('fs-extra')

console.log('\n', process.env.NODE_ENV, '\n')
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const bundlerBuildPath = require.resolve('@s-ui/bundler/bin/sui-bundler-build')

serialSpawn([
  [
    bundlerBuildPath,
    ['-C', '--context', join(__dirname, '..', 'src')],
    {shell: false, env: process.env}
  ]
])
  .then(() => fs.copy('public/index.html', 'public/200.html'))
  .then(code => process.exit(code))
  .catch(code => process.exit(code))

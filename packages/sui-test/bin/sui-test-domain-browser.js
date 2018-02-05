#!/usr/bin/env node
/* eslint no-console:0 */

const program = require('commander')
const {serialSpawn} = require('@s-ui/helpers/cli')
const karmaBin = require.resolve('karma/bin/karma')

program
  .option('-W, --watch', 'Run in watch mode')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Run tests in chorme')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-test-domain browser')
    console.log('')
  })
  .parse(process.argv)

serialSpawn([
  [karmaBin, ['start', require.resolve(`${__dirname}/../lib/karma.conf.js`)]]
], {env: {NODE_ENV: 'test'}}).catch(err => console.log(err))

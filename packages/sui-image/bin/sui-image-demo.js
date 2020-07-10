#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const path = require('path')
const {getSpawnPromise} = require('@s-ui/helpers/cli')
const {processImages} = require('./helpers/imageParser.js')

program
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('    Shows a demo of your all images')
    console.log('')
  })
  .parse(process.argv)

processImages({
  path: 'example/images'
})

const devServerExec = require.resolve('@s-ui/bundler/bin/sui-bundler-dev')

getSpawnPromise(
  devServerExec,
  ['-c', path.join(__dirname, '..', 'src'), '--no-pre-loader'],
  {
    shell: false,
    env: process.env
  }
).then(process.exit, process.exit)

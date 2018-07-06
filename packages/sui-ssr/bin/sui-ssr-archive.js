#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const path = require('path')
const archive = require('../archive')
require('colors')

const pkg = require(path.join(process.cwd(), 'package.json'))
const REMOVE_ZIP_PATH = path.join(process.cwd(), '*.zip')
program
  .option('-C, --clean', 'Remove previous zip')
  .option(
    '-A, --auth <auth>',
    'A string based on username:password that will be used in order to log-in inside our website'
  )
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build a server.zip ready to be upload to a lambda function')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-ssr archive')
    console.log('')
    console.log('')
    console.log('')
    console.log('    $ sui-ssr archive --auth="foo:bar"')
    console.log('')
  })
  .parse(process.argv)

if (program.clean) {
  console.log(' -> Removing ALL previous zip files 🗑 ...'.yellow.bold)
  rimraf.sync(REMOVE_ZIP_PATH)
  console.log(' -> Removed! ✅'.green.bold)
}

const OUTPUT_ZIP_PATH = path.join(process.cwd(), 'server.zip')
;(async () => {
  console.log(' -> Compressing files... 🗄'.yellow)
  await archive({outputZipPath: OUTPUT_ZIP_PATH, pkg})
})()

#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const rimraf = require('rimraf')
const path = require('path')

const archive = require('../archive')

const OUTPUT_ZIP_PATH = path.join(process.cwd(), 'server.zip')
const pkg = require(path.join(process.cwd(), 'package.json'))

program
  .option('-C, --clean', 'Remove previous zip')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Build a server.zip ready to be upload to a lambda function')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-ssr archive')
    console.log('')
  })
  .parse(process.argv)

if (program.clean) {
  console.log('Removing previous zip...')
  rimraf.sync(OUTPUT_ZIP_PATH)
}

;(async () => {
  await archive({ outputZipPath: OUTPUT_ZIP_PATH, pkg })
})()

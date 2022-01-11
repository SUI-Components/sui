#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander')
const migrateDemoFolders = require('./migrations/demo-folders')
const migrateTestFolders = require('./migrations/test-folders')

program
  .on('--help', () => {
    console.log('Migrate any legacy topic to the new structure')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-studio migrate demo')
    console.log('')
    console.log('    $ sui-studio migrate test')
    console.log('')
  })
  .parse(process.argv)

const [topic] = program.args

if (!topic) {
  console.log(
    'An argument is required. Please, try using "test" or "demo" topic'
  )
}

if (topic === 'demo') migrateDemoFolders()
if (topic === 'test') migrateTestFolders()

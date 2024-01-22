#!/usr/bin/env node

const program = require('commander')

program
  .option('-f, --files [files]', 'JSON-stringified list of added and modified files.')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log(
      '    $ publish-tagged-packages --tag ongoing-branch --files \'["packages/sui-mono/foo.js", "packages/sui-bundler/bar.js"]\''
    )
    console.log('')
  })
  .parse(process.argv)

const {files} = program.opts()

console.log({files})

program.exit(0)

#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const appFactory = require('../development')
const exitWithMsg = msg => {
  console.log(msg)
  process.exit(1)
}
const config = require(`${process.cwd()}/package.json`)['sui-widget-embedder'] ||
               exitWithMsg(`Missing sui-widget-embedder config at ${process.cwd()}/package.json`)

const PORT = process.env.PORT || 3000

program
  .usage('-p detail')
  .option('-p, --page <name>', 'Name of the page')
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Start a development server')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embedder development --page detail')
    console.log('')
  })
  .parse(process.argv)

appFactory({page: program.page, config}).listen(PORT, () => console.log(`Server Up and Running port ${PORT}`))

#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const ncp = require('copy-paste')
const {showError} = require('@s-ui/helpers/cli')

const appFactory = require('../development')
let config =
  require(`${process.cwd()}/package.json`)['config']['sui-widget-embedder'] ||
  showError(
    `Missing sui-widget-embedder config at ${process.cwd()}/package.json`
  )

const PORT = process.env.PORT || config.devPort || 3000
config.port = PORT

program
  .arguments('<pathname>')
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

const [pathname] = program.args

appFactory({
  page: program.page,
  pathnameStatic: pathname,
  config
}).listen(PORT, () => {
  ncp.copy(`http://localhost:${config.port}`)
  console.log(`Copied url to clipboard: http://localhost:${PORT}`)
})

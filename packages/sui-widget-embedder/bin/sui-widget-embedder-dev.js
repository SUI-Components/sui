#!/usr/bin/env node
/* eslint no-console:0 */
const program = require('commander')
const ncp = require('copy-paste')

const appFactory = require('../development')
const config =
  require(`${process.cwd()}/package.json`).config['sui-widget-embedder'] || {}

const PORT = process.env.PORT || config.devPort || 3000
config.port = PORT

program
  .usage('-p detail -a address')
  .option('-p, --page <name>', 'Name of the page')
  .option(
    '-a, --address <ip-address>',
    'Local ip address to lookup statics, useful for virtual machines',
    'localhost'
  )
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log('  Start a development server')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embedder development --page detail')
    console.log(
      '    $ sui-widget-embedder development --page detail --address 10.0.2.2'
    )
    console.log('')
  })
  .parse(process.argv)

const {address, page} = program

appFactory({address, page, config}).listen(PORT, () => {
  const scriptToExecute = `(function(s,o,g,r,a,m){a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(document,'script','http://${address}:${PORT}/bundle.js');`
  ncp.copy(scriptToExecute)
  console.log(
    `
✅  Widget compiled in development mode ⚙️!

Steps to use it:

1️⃣  Open the url where you want to inject the widget
2️⃣  Paste the next javascript code in your console and press Enter (it's already in your clipboard 📋):

${scriptToExecute}

💡 You could save the snippet as a bookmark in case you want to improve your development cycle. Just be sure you're always using the same PORT with the widget-embedder.

`
  )
})

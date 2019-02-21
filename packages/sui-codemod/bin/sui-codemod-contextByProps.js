#!/usr/bin/env node
/* eslint no-console:0 */

require('colors')

const program = require('commander')
const path = require('path')
const componentToFolders = require('../transforms/components-to-folders')
const JSCodeShift = require('jscodeshift/src/Runner')

// const pkg = require(path.join(process.cwd(), 'package.json'))

program
  .option('-d, --dry', 'Dont apply changs but logs which changes will be mades')
  .option(
    '-p, --path <pattern>',
    'root path to locate the component',
    'components'
  )
  .on('--help', () => {
    console.log('  Description:')
    console.log('')
    console.log(
      '  According to the new Context API in react. Now we have to use render props to access at the context'
    )
    console.log(
      '  This script will rewrite all occurencies of `this.context` by `this.props`'
    )
    console.log(
      '  After this will move your component code to an `component.js` and create a `index.js` with the render prop component'
    )
    console.log('  to pass the props to our component')
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-codemod contextByProps')
    console.log('')
  })
  .parse(process.argv)

componentToFolders.run({dry: Boolean(program.dry), path: program.path})

JSCodeShift.run(
  path.resolve(path.join(__dirname, '..', 'transforms', 'context-to-props.js')),
  [program.path],
  {
    dry: Boolean(program.dry),
    ignorePattern: ['**/node_modules/**', '**/lib/**'],
    verbose: 2,
    babel: true,
    extensions: 'js',
    runInBand: false,
    silent: false,
    parser: 'babel'
  }
)

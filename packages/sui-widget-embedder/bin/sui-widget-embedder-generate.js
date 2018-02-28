/* eslint no-console:0 */

const program = require('commander')
const colors = require('colors')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const {showError} = require('@s-ui/helpers/cli')
const {writeFile} = require('@s-ui/helpers/file')

program
  .option('-R, --widgetRegExpIdentifier', 'Identifier to inject the widget regarding on if the path match with the regexp')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embeder generate <widget>')
    console.log('    $ sui-widget-embeder generate alfa')
    console.log('    $ custom-help --help')
    console.log('    $ custom-help -h')
    console.log('')
  })
  .parse(process.argv)

const [widget] = program.args

if (!component) { showError('widget name must be defined') }

const wordsOnlyRegex = /^[\w]+$/

if (!wordsOnlyRegex.test(widget)) { showError('Widget name must contain letters or underscore only') }

const BASE_DIR = process.cwd()
const WIDGET_DIR = `/widgets/${widget}/`
const WIDGET_PATH = `${BASE_DIR}${WIDGET_DIR}`
const WIDGET_ENTRY_JS_POINT_FILE = `${WIDGET_PATH}src/index.js`
const WIDGET_PACKAGE_JSON_FILE = `${WIDGET_PATH}package.json`
const WIDGET_ENTRY_SCSS_POINT_FILE = `${WIDGET_PATH}src/index.scss`

const {widgetRegExpIdentifier} = program
const { config: { sitePrefix }} = require(path.join(process.cwd(), 'package.json'))
// Check if the widget already exist before continuing
if (fs.existsSync(WIDGET_PATH)) {
  showError(`[${widget}] This widget already exist in the path:
  ${WIDGET_PATH}`)
}

Promise.all([
  writeFile(
    WIDGET_PACKAGE_JSON_FILE,
    `{
      "version": "1.0.0",
      "private": true,
      "pathnameRegExp": "${widgetRegExpIdentifier || '*'}"
      }
    `),
  writeFile(
    WIDGET_ENTRY_JS_POINT_FILE,
    `
      import React from 'react'
      import Widget from '@s-ui/widget-embedder/react/Widget'
      import Widgets from '@s-ui/widget-embedder/react/Widgets'
      import render from '@s-ui/widget-embedder/react/render'
      import './index.scss'
      
      const bootstrap = async () => {
        render(
          <Widgets>
            <Widget node='<node-name>'>
              {/*YOUR COMPONENT GOES HERE*/}
            </Widget>
          </Widgets>,
          'global'
        )
      }
      
      bootstrap()
`),

  writeFile(
    WIDGET_ENTRY_SCSS_POINT_FILE,
    `@import '~@schibstedspain/${sitePrefix}-theme/lib/index.scss';`)
])
  .then(() => {
    console.log(colors.gray(`[${widget}]: Installing the dependencies`))
  })

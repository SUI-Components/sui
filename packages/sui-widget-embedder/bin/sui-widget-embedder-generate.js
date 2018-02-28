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
    console.log('    $ sui-widget-embeder generate <category> <widget>')
    console.log('    $ sui-widget-embeder generate pages alfa')
    console.log('    $ sui-widget-embeder generate searchs re-beta -P mt')
    console.log('    $ sui-widget-embeder generate searchs re-beta -R -C')
    console.log('    $ custom-help --help')
    console.log('    $ custom-help -h')
    console.log('')
  })
  .parse(process.argv)

const BASE_DIR = process.cwd()
const [category, widget] = program.args

if (!component) { showError('widget name must be defined') }
if (!category) { showError('category name must be defined') }

const wordsOnlyRegex = /^[\w]+$/

if (!wordsOnlyRegex.test(widget)) { showError('Widget name must contain letters or underscore only') }
if (!wordsOnlyRegex.test(category)) { showError('Category name must contain letters or underscore only') }

const WIDGET_DIR = `/widgets/${category}/${component}/`
const WIDGET_PATH = `${BASE_DIR}${WIDGET_DIR}`
const WIDGET_ENTRY_JS_POINT_FILE = `${WIDGET_PATH}src/index.js`
const WIDGET_PACKAGE_JSON_FILE = `${WIDGET_PATH}package.json`
const WIDGET_ENTRY_SCSS_POINT_FILE = `${WIDGET_PATH}src/index.scss`


const {widgetRegExpIdentifier} = program
!widgetRegExpIdentifier && showError('You MUST provide a regexp identifier to the widget embedder')
const packageInfo = require(path.join(process.cwd(), 'package.json'))
const widgetNameIdentifier = `${category}/${widget}`
// Check if the component already exist before continuing
if (fs.existsSync(WIDGET_PATH)) {
  showError(`[${packageName}] This widget already exist in the path:
  ${WIDGET_PATH}`)
}

if (!repository.url || !homepage) {
  console.log(`Missing repository and/or homepage field in monorepo package.json
Component is created without those fields.`.yellow)
}

Promise.all([
  writeFile(
    WIDGET_PACKAGE_JSON_FILE,
    `{
      "version": "1.0.0",
      "private": true,
      "pathnameRegExp": "${widgetRegExpIdentifier || '*'}"
      }0
    `),
  writeFile(
    WIDGET_ENTRY_JS_POINT_FILE,
    `import React, {Component} from 'react'
import PropTypes from 'prop-types'

class ${componentInPascal} extends Component {
  render () {
    return (
      <div className='${prefix}-${componentInPascal}'>
        <h1>${componentInPascal}</h1>
      </div>
    )
  }
}

${componentInPascal}.displayName = '${componentInPascal}'

// Remove these comments if you need
// ${componentInPascal}.contextTypes = {i18n: PropTypes.object}
// ${componentInPascal}.propTypes = {}
// ${componentInPascal}.defaultProps = {}

export default ${componentInPascal}`
  ),

  writeFile(
    WIDGET_ENTRY_SCSS_POINT_FILE,
    `@import '~@schibstedspain/sui-theme/lib/index';

.${prefix}-${componentInPascal} {
  // Do your magic
}`)
])
  .then(() => {
    console.log(colors.gray(`[${packageName}]: Installing the dependencies`))
  })

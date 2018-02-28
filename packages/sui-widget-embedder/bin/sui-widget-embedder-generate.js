/* eslint no-console:0 */

const program = require('commander')
const colors = require('colors')
const fs = require('fs')
const path = require('path')
const {showError} = require('@s-ui/helpers/cli')
const {writeFile} = require('@s-ui/helpers/file')

const indexJS = require('../file-templates/_index.js.js')
const packageJSON = require('../file-templates/_package.json.js')
const indexSCSS = require('../file-templates/_index.scss.js')

program
  .option('-E, --widgetRegExpIdentifier <regExp>', 'Identifier to inject the widget regarding on if the path match with the regexp')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embedder generate <widget>')
    console.log('    $ sui-widget-embedder generate alfa')
    console.log('    $ sui-widget-embedder generate alfa -E \'/d\\\\w+\\\\.html\'')
    console.log('    $ custom-help --help')
    console.log('    $ custom-help -h')
    console.log('')
    console.log(colors.magenta('    IMPORTANT - Regexp (-E) must be with commas ALWAYS to avoid terminal escape or interpretation'))
    console.log('')
  })
  .parse(process.argv)

const [widget] = program.args

if (!widget) { showError('widget name must be defined') }

const wordsOnlyRegex = /^[\w]+$/

if (!wordsOnlyRegex.test(widget)) { showError('Widget name must contain letters or underscore only') }

const BASE_DIR = process.cwd()
const WIDGET_DIR = `/widgets/${widget}/`
const WIDGET_PATH = `${BASE_DIR}${WIDGET_DIR}`
const WIDGET_ENTRY_JS_POINT_FILE = `${WIDGET_PATH}index.js`
const WIDGET_PACKAGE_JSON_FILE = `${WIDGET_PATH}package.json`
const WIDGET_ENTRY_SCSS_POINT_FILE = `${WIDGET_PATH}index.scss`
const WIDGET_BASE_PROJECT_JSON_POINT_FILE = path.join(process.cwd(), 'package.json')
const {widgetRegExpIdentifier} = program
const packageInfo = require(path.join(process.cwd(), 'package.json'))
packageInfo.scripts[`start:${widget}`] = `sui-widget-embedder dev -p ${widget}`
const sitePrefix = packageInfo.config['sui-widget-embedder'].sitePrefix

// Check if the widget already exist before continuing
if (fs.existsSync(WIDGET_PATH)) {
  showError(`[${widget}] This widget already exist in the path:
  ${WIDGET_PATH}`)
}

Promise.all([
  writeFile(
    WIDGET_PACKAGE_JSON_FILE, packageJSON(widgetRegExpIdentifier)),
  writeFile(WIDGET_ENTRY_JS_POINT_FILE, indexJS()),
  writeFile(
    WIDGET_ENTRY_SCSS_POINT_FILE, indexSCSS(sitePrefix)),
  writeFile(
    WIDGET_BASE_PROJECT_JSON_POINT_FILE, JSON.stringify(packageInfo, null, '  '))
])
  .then(() => {
    console.log(colors.green(`➜ [${widget}]: Your widget files have been generated successfully`))
  })

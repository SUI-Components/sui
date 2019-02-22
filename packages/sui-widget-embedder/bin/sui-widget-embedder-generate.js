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

const PAGES_FOLDER = 'pages'

program
  .option(
    '-E, --pageRegExpIdentifier <regExp>',
    'Identifier to inject the widgets of the page regarding on if the path match with the regexp'
  )
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ sui-widget-embedder generate <page>')
    console.log('    $ sui-widget-embedder generate detailPage')
    console.log(
      "    $ sui-widget-embedder generate detailPage -E '/d\\\\w+\\\\.html'"
    )
    console.log('    $ custom-help --help')
    console.log('    $ custom-help -h')
    console.log('')
    console.log(
      colors.magenta(
        '    IMPORTANT - Regexp (-E) must be with commas ALWAYS to avoid terminal escape or interpretation'
      )
    )
    console.log('')
  })
  .parse(process.argv)

const [page] = program.args

if (!page) {
  showError('page name must be defined')
}

const wordsOnlyRegex = /^[\w]+$/

if (!wordsOnlyRegex.test(page)) {
  showError('Page name must contain letters or underscore only')
}

const BASE_DIR = process.cwd()
const PAGE_DIR = `/${PAGES_FOLDER}/${page}/`
const PAGE_PATH = `${BASE_DIR}${PAGE_DIR}`
const PAGE_ENTRY_JS_POINT_FILE = `${PAGE_PATH}index.js`
const PAGE_PACKAGE_JSON_FILE = `${PAGE_PATH}package.json`
const PAGE_ENTRY_SCSS_POINT_FILE = `${PAGE_PATH}index.scss`
const PAGE_BASE_PROJECT_JSON_FILE = path.join(process.cwd(), 'package.json')
const {pageRegExpIdentifier} = program
const packageInfo = require(PAGE_BASE_PROJECT_JSON_FILE)
packageInfo.scripts[`start:${page}`] = `sui-widget-embedder dev -p ${page}`

const {config = {}} = packageInfo
const {sitePrefix = ''} = config['sui-widget-embedder'] || {}

// Check if the page already exist before continuing
if (fs.existsSync(PAGE_PATH)) {
  showError(`[${page}] This page already exist in the path:
  ${PAGE_PATH}`)
}

Promise.all([
  writeFile(PAGE_PACKAGE_JSON_FILE, packageJSON(pageRegExpIdentifier)),
  writeFile(PAGE_ENTRY_JS_POINT_FILE, indexJS()),
  writeFile(PAGE_ENTRY_SCSS_POINT_FILE, indexSCSS(sitePrefix)),
  writeFile(
    PAGE_BASE_PROJECT_JSON_FILE,
    JSON.stringify(packageInfo, null, '  ')
  )
]).then(() => {
  console.log(
    colors.green(
      `➜ [${page}]: Your page files have been generated successfully.`
    )
  )
})

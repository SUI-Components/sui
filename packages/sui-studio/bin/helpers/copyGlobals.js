const copy = require('copyfiles')
const fs = require('fs')

const GLOBALS_FILE_PATH = 'components/globals.js'
const DESTINATION_FOLDER = 'public'

module.exports = function copyGlobals() {
  if (fs.existsSync(GLOBALS_FILE_PATH)) {
    console.log('*** globals detected ***') // eslint-disable-line
  } else {
    fs.writeFileSync(GLOBALS_FILE_PATH, '// globals file', 'utf8')
  }
  copy([GLOBALS_FILE_PATH, DESTINATION_FOLDER], () =>
    console.log('[sui-studio] Copied globals file correctly')
  )
}

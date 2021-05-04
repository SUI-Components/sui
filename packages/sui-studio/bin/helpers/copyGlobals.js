const cpy = require('cpy')
const fs = require('fs')

const GLOBALS_FILE_PATH = 'components/globals.js'

module.exports = function copyGlobals() {
  if (fs.existsSync(GLOBALS_FILE_PATH)) {
    console.log('*** globals detected ***') // eslint-disable-line
  } else {
    fs.writeFileSync(GLOBALS_FILE_PATH, '// globals file', 'utf8')
  }
  cpy([GLOBALS_FILE_PATH], 'public', {
    parents: true
  })
}

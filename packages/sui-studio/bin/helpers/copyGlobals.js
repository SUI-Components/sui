const cpy = require('cpy')
const fs = require('fs')

module.exports = function copyGlobals() {
  if (fs.existsSync('demo/globals.js')) {
    console.log('*** globals detected ***')   // eslint-disable-line
  } else {
    fs.writeFileSync('demo/globals.js', '// globals file', 'utf8')
  }
  cpy(['demo/globals.js'], 'public', {
    parents: true
  })
}

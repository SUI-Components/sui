// missing ./index.js
const a = require('./file/index.js')
// missing file extension .js
const b = require('./file/index')
// complete file path
const c = require('./file/')
// complete same folder file path
const d = require('./b.js')
// incomplete with same folder file path missing extension
const dd = require('./b')
// same folder index.js
const ddd = require('./')
// parent folder relative file path
const e = require('../test/file/index.js')
// parent folder relative file path without extension
const f = require('../test/file/index')
// parent folder relative file path without index.js
const g = require('../test/file')

export default function whatever() {
  return 'this is coooool'
}

console.log(a, b, c, d, dd, ddd, e, f, g)

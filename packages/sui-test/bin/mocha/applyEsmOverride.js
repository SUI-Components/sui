const _module = require('node:module')
const fs = require('node:fs')

_module.Module._extensions['.js'] = (module, filename) => module._compile(fs.readFileSync(filename, 'utf8'), filename)

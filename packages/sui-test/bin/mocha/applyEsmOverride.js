const _module = require('module')
const fs = require('fs')
_module.Module._extensions['.js'] = (module, filename) =>
  module._compile(fs.readFileSync(filename, 'utf8'), filename)

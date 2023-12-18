const webpack = require('webpack')

// hack for Windows, as process.env.PWD is undefined in that environment
// https://github.com/mrblueblue/gettext-loader/issues/18
if (process.platform === 'win32') {
  process.env.PWD = process.cwd()
}

const {MAGIC_STRINGS = '{}'} = process.env

let magic
try {
  magic = JSON.parse(MAGIC_STRINGS)
} catch (err) {
  magic = {}
}

module.exports = (vars = {}) => {
  const definitions = {
    __DEV__: false,
    __BASE_DIR__: JSON.stringify(process.env.PWD),
    ...vars,
    ...Object.fromEntries(Object.entries(magic).map(([key, value]) => [key, JSON.stringify(value)]))
  }

  return new webpack.DefinePlugin(definitions)
}

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

module.exports = (vars = {}) =>
  new webpack.DefinePlugin({
    __DEV__: false,
    __BASE_DIR__: JSON.stringify(process.env.PWD),
    __MOCKS_API_PATH__: JSON.stringify(process.env.MOCKS_API_PATH || process.env.PWD + '/mocks/routes'),
    ...vars,
    ...Object.fromEntries(Object.entries(magic).map(([key, value]) => [key, JSON.stringify(value)]))
  })

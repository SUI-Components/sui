const webpack = require('webpack')

// hack for Windows, as process.env.PWD is undefined in that environment
// https://github.com/mrblueblue/gettext-loader/issues/18
if (process.platform === 'win32') {
  process.env.PWD = process.cwd()
}

const defaults = {
  __DEV__: false,
  __BASE_DIR__: JSON.stringify(process.env.PWD)
}

module.exports = (vars = {}) =>
  new webpack.DefinePlugin(Object.assign({}, defaults, vars))

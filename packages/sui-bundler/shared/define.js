const webpack = require('webpack')

// hack for Windows, as process.env.PWD is undefined in that environment
// https://github.com/mrblueblue/gettext-loader/issues/18
if (process.platform === 'win32') {
  process.env.PWD = process.cwd()
}

module.exports = (vars = {}) =>
  new webpack.DefinePlugin({
    __DEV__: false,
    __BASE_DIR__: JSON.stringify(process.env.PWD),
    ...vars
  })

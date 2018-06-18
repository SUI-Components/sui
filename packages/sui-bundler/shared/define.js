const webpack = require('webpack')

let pwd = process.cwd()

// hack for Windows, as process.env.PWD is undefined in that environment
// https://github.com/mrblueblue/gettext-loader/issues/18
// Moreover, to have same caseing we need to map it.
if (process.platform === 'win32') {
  const [driveLetter, path] = pwd.split(':')
  pwd = [driveLetter.toLowerCase(), path].join(':')
  process.env.PWD = pwd
}

module.exports = new webpack.DefinePlugin({
  __DEV__: false,
  __BASE_DIR__: JSON.stringify(process.env.PWD)
})

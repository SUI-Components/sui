const {sep} = require('path')

module.exports = {
  test: /\.jsx?$/,
  exclude: new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      cacheDirectory: false,
      compact: true,
      presets: ['sui']
    }
  }
}

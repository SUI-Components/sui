const {sep} = require('path')

module.exports = {
  test: /\.jsx?$/,
  exclude: new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
  loader: 'babel-loader',
  query: {
    babelrc: false,
    presets: ['sui']
  }
}

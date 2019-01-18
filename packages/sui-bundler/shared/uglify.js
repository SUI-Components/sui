const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = new UglifyJsPlugin({
  cache: true,
  parallel: true,
  sourceMap: true
})

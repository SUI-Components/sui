const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = new UglifyJsPlugin({
  cache: true,
  parallel: true,
  sourceMap: true // set to true if you want JS source maps
})

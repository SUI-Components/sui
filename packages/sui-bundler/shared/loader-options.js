// Contains loaders options to avoid duplication between
// webpack prod and dev configs

const jsonImporter = require('node-sass-json-importer')

module.exports = {
  'sass-loader': {
    importer: [jsonImporter]
  },
  'postcss-loader': {
    plugins: loader => [require('autoprefixer')()]
  }
}

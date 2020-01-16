module.exports = {
  'sass-loader': {
    sassOptions: {
      importer: [require('node-sass-json-importer')()]
    }
  },
  'postcss-loader': {
    plugins: _ => [require('autoprefixer')()]
  }
}

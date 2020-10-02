module.exports = {
  'sass-loader': {
    sassOptions: {
      importer: []
    }
  },
  'postcss-loader': {
    plugins: _ => [require('autoprefixer')()]
  }
}

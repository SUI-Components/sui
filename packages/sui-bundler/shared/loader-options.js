// Contains loaders options to avoid duplication between
// webpack prod and dev configs
module.exports = {
  'postcss-loader': {
    plugins: loader => [require('autoprefixer')()]
  }
}

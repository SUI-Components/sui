const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const parcelCSS = require('@parcel/css')

const {cleanList, config, when} = require('./index.js')

module.exports = {
  test: /(\.css|\.scss)$/,
  use: cleanList([
    MiniCssExtractPlugin.loader,
    require.resolve('css-loader'),
    when(config['externals-manifest'], () => ({
      loader: 'externals-manifest-loader',
      options: {
        manifestURL: config['externals-manifest']
      }
    })),
    {
      loader: require.resolve('parcel-css-loader'),
      options: {
        implementation: parcelCSS
      }
    },
    require.resolve('@s-ui/sass-loader')
  ])
}

const {ParcelCssMinifyPlugin} = require('parcel-css-loader')
const parcelCss = require('@parcel/css')

const createCssMinimizerPlugin = () =>
  new ParcelCssMinifyPlugin({
    implementation: parcelCss
  })

module.exports = () => createCssMinimizerPlugin()

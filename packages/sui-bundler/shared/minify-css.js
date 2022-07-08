const {ParcelCssMinifyPlugin} = require('parcel-css-loader')

const createCssMinimizerPlugin = () => new ParcelCssMinifyPlugin()

module.exports = () => createCssMinimizerPlugin()

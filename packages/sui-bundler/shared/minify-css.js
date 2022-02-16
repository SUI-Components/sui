const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const createCssMinimizerPlugin = () =>
  new CssMinimizerPlugin({
    minify: CssMinimizerPlugin.parcelCssMinify,
    minimizerOptions: {
      targets: {ie: 11}
    }
  })

module.exports = () => createCssMinimizerPlugin()

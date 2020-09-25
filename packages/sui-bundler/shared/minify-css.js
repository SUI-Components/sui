const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = () =>
  new CssMinimizerPlugin({
    minimizerOptions: {
      preset: [
        'default',
        {
          discardComments: {removeAll: true}
        }
      ]
    }
  })

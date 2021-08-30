const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const createCssMinimizerPlugin = () =>
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

module.exports = ({useExperimentalMinifier}) =>
  !useExperimentalMinifier && createCssMinimizerPlugin()

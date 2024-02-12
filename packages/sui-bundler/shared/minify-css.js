import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

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

export default () => createCssMinimizerPlugin()

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {cleanList, config, when} = require('./index')

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
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [
            require('autoprefixer')({
              overrideBrowserslist: config.targets
            })
          ]
        }
      }
    },
    require.resolve('@s-ui/sass-loader')
  ])
}

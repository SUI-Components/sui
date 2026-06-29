const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {cleanList, config, when, isTailwindEnabled} = require('./index')

const plainCssPackages = config.plainCssPackages || []

const plainCssExclude = plainCssPackages.length
  ? new RegExp(
      `node_modules[\\\\/](${plainCssPackages.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})[\\\\/]`
    )
  : null

const sassRule = {
  test: /(\.css|\.scss)$/,
  ...(plainCssExclude ? {exclude: plainCssExclude} : {}),
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
            ...(isTailwindEnabled() ? [require('tailwindcss')()] : []),
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

const plainCssRule = plainCssExclude
  ? {
      test: /\.css$/,
      include: plainCssExclude,
      use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')]
    }
  : null

module.exports = plainCssRule ? [sassRule, plainCssRule] : sassRule

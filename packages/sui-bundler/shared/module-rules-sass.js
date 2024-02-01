import {createRequire} from 'module'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import {cleanList, config, when} from './index.js'

const require = createRequire(import.meta.url)

export default {
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

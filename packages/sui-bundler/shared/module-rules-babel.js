const {sep} = require('path')
const {config} = require('./')

const {TS: isTypeScript = false} = process.env

const exclude = new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`)

module.exports = isTypeScript
  ? {
      test: /\.(js|ts)x?$/,
      exclude,
      use: [
        {
          loader: require.resolve('swc-loader')
        }
      ]
    }
  : {
      test: /\.jsx?$/,
      exclude,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            babelrc: false,
            compact: true,
            presets: [
              [
                require.resolve('babel-preset-sui'),
                {
                  targets: config.targets
                }
              ]
            ]
          }
        }
      ]
    }

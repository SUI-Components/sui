const path = require('path')
const {config} = require('./index.js')

const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)

module.exports = ({isServer = false, supportLegacyBrowsers = false} = {}) => ({
  test: /\.jsx?$/,
  exclude: EXCLUDED_FOLDERS_REGEXP,
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
              isServer,
              supportLegacyBrowsers,
              targets: config.targets
            }
          ]
        ]
      }
    }
  ]
})

const path = require('path')
const {config} = require('./index.js')

const DEFAULT_SERVER_TARGETS = {node: '16'}
const EXCLUDED_FOLDERS_REGEXP = new RegExp(
  `node_modules(?!${path.sep}@s-ui(${path.sep}studio)(${path.sep}workbench)?${path.sep}src)`
)

const getTargets = ({isServer}) => {
  const targets = config.targets
  if (isServer && targets == null) return DEFAULT_SERVER_TARGETS

  return targets
}

module.exports = ({isServer = false} = {}) => ({
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
              targets: getTargets({isServer})
            }
          ]
        ]
      }
    }
  ]
})

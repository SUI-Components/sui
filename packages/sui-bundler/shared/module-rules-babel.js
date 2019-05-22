const {sep} = require('path')
const {config} = require('./shared')

module.exports = ({isModern, isServer} = {}) => ({
  test: /\.jsx?$/,
  exclude: isModern
    ? undefined
    : new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        compact: true,
        presets: [
          [require.resolve('babel-preset-sui')],
          {
            isModern,
            isServer,
            targets: config.targets
          }
        ]
      }
    },
    require.resolve('source-map-loader')
  ]
})

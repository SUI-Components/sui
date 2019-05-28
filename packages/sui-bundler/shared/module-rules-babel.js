const {config} = require('./index')

module.exports = ({isServer} = {}) => ({
  test: /\.jsx?$/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        compact: true,
        presets: [
          [
            require.resolve('babel-preset-sui'),
            {
              isServer,
              targets: config.targets
            }
          ]
        ]
      }
    },
    require.resolve('source-map-loader')
  ]
})

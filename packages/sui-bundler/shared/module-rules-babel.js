const {sep} = require('path')
const {config} = require('./')

module.exports = {
  test: /\.jsx?$/,
  exclude: new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
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
              targets: config.targets
            }
          ]
        ]
      }
    }
  ]
}

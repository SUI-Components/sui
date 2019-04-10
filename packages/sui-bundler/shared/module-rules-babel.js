const {sep} = require('path')

module.exports = ({es6 = false} = {}) => ({
  test: /\.jsx?$/,
  exclude: es6
    ? undefined
    : new RegExp(`node_modules(?!${sep}@s-ui${sep}studio${sep}src)`),
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        compact: true,
        presets: [[require.resolve('babel-preset-sui'), {es6}]]
      }
    },
    'source-map-loader'
  ]
})
